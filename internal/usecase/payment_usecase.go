package usecase

import (
	"fmt"
	"log"
	"net/http"
	"net/url"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/SebaVCH/ERPBackendVentas/internal/domain"
	"github.com/SebaVCH/ERPBackendVentas/internal/repository"
	"github.com/gin-gonic/gin"
)

type PaymentUsecase interface {
	CreateCheckout(c *gin.Context)
	PaymentSuccessHandler(c *gin.Context)
	PaymentPendingHandler(c *gin.Context)
	PaymentFailureHandler(c *gin.Context)
}

type paymentUsecase struct {
	PayRepo       repository.PaymentRepository
	CartRepo      repository.CartRepository
	SaleRepo      repository.SaleRepository
	CustomerRepo  repository.CustomerRepository
	DirectionRepo repository.DirectionRepository
}

const (
	CheckoutExpiryMinutes = 5
	PaymentStatusApproved = "approved"
	SaleStatusPaid        = "PAGADO"
	PaymentConditionFull  = "Pago Completo"
)

func NewPaymentUsecase(payRepo repository.PaymentRepository, cartRepo repository.CartRepository, saleRepo repository.SaleRepository, customerRepo repository.CustomerRepository, directionRepo repository.DirectionRepository) PaymentUsecase {
	return &paymentUsecase{
		PayRepo:       payRepo,
		CartRepo:      cartRepo,
		SaleRepo:      saleRepo,
		CustomerRepo:  customerRepo,
		DirectionRepo: directionRepo,
	}
}

type CreateCheckoutRequest struct {
	IDCliente   int     `json:"id_cliente" binding:"required"`
	IDDireccion int     `json:"id_direccion" binding:"required"`
	Amount      float64 `json:"amount" binding:"required"`
	Title       string  `json:"title"`
}

func (pu *paymentUsecase) CreateCheckout(c *gin.Context) {
	var req CreateCheckoutRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, APIResponse{Success: false, Message: "request inválido", Error: err.Error()})
		return
	}

	// Obtener el email del cliente
	customer, err := pu.CustomerRepo.GetCustomerByID(req.IDCliente)
	if err != nil {
		c.JSON(http.StatusNotFound, APIResponse{Success: false, Message: "cliente no encontrado", Error: err.Error()})
		return
	}

	if customer.Email == "" {
		c.JSON(http.StatusBadRequest, APIResponse{Success: false, Message: "el cliente no tiene email configurado"})
		return
	}

	// Validar que la dirección pertenezca al cliente
	direction, err := pu.DirectionRepo.GetDirectionByID(req.IDDireccion)
	if err != nil {
		c.JSON(http.StatusNotFound, APIResponse{Success: false, Message: "dirección no encontrada", Error: err.Error()})
		return
	}

	if direction.IDCliente != req.IDCliente {
		c.JSON(http.StatusForbidden, APIResponse{Success: false, Message: "la dirección no pertenece al cliente"})
		return
	}

	// Hacer la reserva de los productos
	if err := pu.CartRepo.ReserveSaleStock(req.IDCliente); err != nil {
		c.JSON(http.StatusInternalServerError, APIResponse{Success: false, Message: "Cart Reserve error", Error: err.Error()})
		return
	}

	// external_ref=id_cliente,id_direccion
	externalRef := strconv.FormatInt(int64(req.IDCliente), 10) + "," + strconv.FormatInt(int64(req.IDDireccion), 10)

	// Crear la preference con expiración corta (5 minutos)
	initPoint, prefID, err := pu.PayRepo.CreatePreference(req.Amount, req.Title, externalRef, customer.Email, CheckoutExpiryMinutes)
	if err != nil {
		c.JSON(http.StatusInternalServerError, APIResponse{Success: false, Message: "error creando preference", Error: err.Error()})
		return
	}

	c.JSON(http.StatusCreated, APIResponse{
		Success: true,
		Message: "preference creada",
		Data: gin.H{
			"init_point":    initPoint,
			"preference_id": prefID,
		},
	})
}

func (pu *paymentUsecase) PaymentPendingHandler(c *gin.Context) {
	paymentID, err := pu.parsePaymentID(c.Query("payment_id"))
	if err != nil {
		pu.redirectToFailure(c, "payment id no válido", 0)
		return
	}

	detail, err := pu.PayRepo.GetPaymentDetail(paymentID)
	if err != nil {
		log.Printf("Error getting payment detail for ID %d: %v", paymentID, err)
		pu.redirectToFailure(c, "Pago pendiente - Error al obtener detalles", paymentID)
		return
	}

	pu.redirectToFailure(c, fmt.Sprintf("Pago pendiente: %s", detail.StatusDetail), paymentID)
}

func (pu *paymentUsecase) PaymentFailureHandler(c *gin.Context) {
	paymentID, err := pu.parsePaymentID(c.Query("payment_id"))
	if err != nil {
		pu.redirectToFailure(c, "payment id no válido", 0)
		return
	}

	detail, err := pu.PayRepo.GetPaymentDetail(paymentID)
	if err != nil {
		log.Printf("Error getting payment detail for ID %d: %v", paymentID, err)
		pu.redirectToFailure(c, "Error al obtener detalles del pago", paymentID)
		return
	}

	pu.redirectToFailure(c, detail.StatusDetail, paymentID)
}

func (pu *paymentUsecase) PaymentSuccessHandler(c *gin.Context) {

	strPaymentID := c.Query("payment_id")
	status := c.Query("status")
	externalRef := c.Query("external_reference")
	collectionStatus := c.Query("collection_status")
	paymentType := c.Query("payment_type")

	paymentID, err := pu.parsePaymentID(strPaymentID)
	if err != nil {
		pu.redirectToFailure(c, "payment id inválido", 0)
		return
	}

	// Verificar el payment_id con Mercado Pago
	detail, err := pu.PayRepo.GetPaymentDetail(paymentID)
	if err != nil {
		log.Printf("Error getting payment detail for ID %d: %v", paymentID, err)
		pu.redirectToFailure(c, "Error al verificar el pago con Mercado Pago", paymentID)
		return
	}

	// Verificar que el pago esté realmente aprobado según MP
	if detail.Status != PaymentStatusApproved {
		log.Printf("Payment ID %d not approved. Status: %s, StatusDetail: %s", paymentID, detail.Status, detail.StatusDetail)
		pu.redirectToFailure(c, fmt.Sprintf("Pago no aprobado: %s", detail.StatusDetail), paymentID)
		return
	}

	IDCliente, IDDireccion, err := pu.parseExternalRef(externalRef)
	if err != nil {
		pu.redirectToFailure(c, "external ref formato inválido", paymentID)
		return
	}

	if status != PaymentStatusApproved && collectionStatus != PaymentStatusApproved {
		pu.redirectToFailure(c, "pago no aprovado", paymentID)
		return
	}

	if IDCliente <= 0 {
		pu.redirectToFailure(c, "id cliente inválido (<= 0)", paymentID)
		return
	}

	cart, items, err := pu.CartRepo.GetCartItems(IDCliente)
	if err != nil {
		pu.redirectToFailure(c, err.Error(), paymentID)
		return
	}
	if cart == nil {
		pu.redirectToFailure(c, "carrito vacio", paymentID)
		return
	}

	// Construir detalles desde los items del carrito y calcular total
	var detalles []domain.DetalleVenta
	var total float64
	for _, it := range items {
		detalles = append(detalles, domain.DetalleVenta{
			IDProducto: it.IDProducto,
			Cantidad:   it.Cantidad,
			PrecioVenta: it.PrecioVenta,
		})
		total += float64(it.Cantidad) * it.PrecioVenta
	}

	venta := domain.Venta{
		IDCliente:         IDCliente,
		IDCarrito:         cart.IDCart,
		IDDireccion:       IDDireccion,
		FechaPedido:       time.Now(),
		Total:             total,
		Estado:            SaleStatusPaid,
		FormaDePago:       paymentType,
		CondicionesDePago: PaymentConditionFull,
	}

	if err := pu.SaleRepo.CreateSale(&venta, detalles); err != nil {
		pu.redirectToFailure(c, err.Error(), paymentID)
		return
	}

	c.Redirect(http.StatusSeeOther, fmt.Sprintf("%s/payment/success?order_id=%d", os.Getenv("HOST_FRONTEND"), venta.IDVenta))
}

func (pu *paymentUsecase) buildFailureURL(message string, paymentID int64) string {
	baseURL := fmt.Sprintf("%s/payment/failure", os.Getenv("HOST_FRONTEND"))
	params := url.Values{}
	params.Add("message", message)
	if paymentID > 0 {
		params.Add("payment_id", strconv.FormatInt(paymentID, 10))
	}
	return fmt.Sprintf("%s?%s", baseURL, params.Encode())
}

func (pu *paymentUsecase) parsePaymentID(strID string) (int64, error) {
	if strID == "" {
		return 0, fmt.Errorf("payment_id is required")
	}

	id, err := strconv.ParseInt(strID, 10, 64)
	if err != nil {
		return 0, err
	}

	if id <= 0 {
		return 0, fmt.Errorf("payment_id must be positive")
	}

	return id, nil
}

func (pu *paymentUsecase) redirectToFailure(c *gin.Context, message string, paymentID int64) {
	redirectURL := pu.buildFailureURL(message, paymentID)
	c.Redirect(http.StatusSeeOther, redirectURL)
}

func (pu *paymentUsecase) parseExternalRef(externalRef string) (IDCliente int, IDDireccion int, err error) {
	parts := strings.Split(externalRef, ",")
	if len(parts) != 2 {
		return -1, -1, fmt.Errorf("invalid external reference format: %s", externalRef)
	}

	IDCliente, err = strconv.Atoi(parts[0])
	if err != nil {
		return -1, -1, fmt.Errorf("Invalid id_cliente: %s", err.Error())
	}

	IDDireccion, err = strconv.Atoi(parts[1])
	if err != nil {
		return -1, -1, fmt.Errorf("Invalid id_direccion: %s", err.Error())
	}

	return IDCliente, IDDireccion, nil
}
