package usecase

import (
	"fmt"
	"net/http"
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
	PayRepo  repository.PaymentRepository
	CartRepo repository.CartRepository
    SaleRepo repository.SaleRepository
}

func NewPaymentUsecase(payRepo repository.PaymentRepository, cartRepo repository.CartRepository, saleRepo repository.SaleRepository) PaymentUsecase {
	return &paymentUsecase{
		PayRepo:  payRepo,
		CartRepo: cartRepo,
        SaleRepo: saleRepo,
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
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "request inválido", "error": err.Error()})
		return
	}

    // IMPORTANTE-VALIDAR ID_DIRECCION DEL CLIENTE

	// Hacer la reserva de los productos
	if err := pu.CartRepo.ReserveSaleStock(req.IDCliente); err != nil {
		c.JSON(http.StatusInternalServerError, APIResponse{
			Success: false,
			Message: "Cart Reserve error",
			Error:   err.Error(),
		})
		return
	}
    
    // id_cliente,id_direccion
	externalRef := strconv.FormatInt(int64(req.IDCliente), 10) + "," + strconv.FormatInt(int64(req.IDDireccion), 10)

	// Crear la preference con expiración corta (5 minutos)
	const expiryMinutes = 5
	initPoint, prefID, err := pu.PayRepo.CreatePreference(req.Amount, req.Title, externalRef, expiryMinutes)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "error creando preference", "error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "preference creada",
		"data":    gin.H{"init_point": initPoint, "preference_id": prefID},
	})
}

func (pu *paymentUsecase) PaymentFailureHandler(c *gin.Context) {

	panic("unimplemented")
}

func (pu *paymentUsecase) PaymentPendingHandler(c *gin.Context) {
	panic("unimplemented")
}

func(pu *paymentUsecase) parseExternalRef(externalRef string) (IDCliente int, IDDireccion int, err error) {
    parts := strings.Split(externalRef, ",")
    if len(parts) != 2 {
        return -1, -1, fmt.Errorf("invalid external reference format: %s", externalRef)
    }

    IDCliente, err = strconv.Atoi(parts[0])
    if err != nil {
        return -1, -1, fmt.Errorf("Invalid id_cliente: %", err.Error())
    } 

    IDDireccion, err = strconv.Atoi(parts[1])
    if err != nil {
        return -1, -1, fmt.Errorf("Invalid id_direccion: %", err.Error())
    }

    return IDCliente, IDDireccion, nil
}

func (pu *paymentUsecase) PaymentSuccessHandler(c *gin.Context) {


    // paymentID := c.Query("payment_id")
    status := c.Query("status")
    externalRef := c.Query("external_reference")
    collectionStatus := c.Query("collection_status")
    paymentType := c.Query("payment_type")

    // IMPORTANTE - VERIFICAR PAYMENT_ID

    IDCliente, IDDireccion, err := pu.parseExternalRef(externalRef)
    if err != nil {
        c.Redirect(http.StatusSeeOther, "http://localhost:5173/payment/failure")
        return 
    }

    fmt.Printf("ID_CLIENTE: %, ID_DIRECCION: %", IDCliente, IDDireccion)

    if status != "approved" && collectionStatus != "approved" {
        c.Redirect(http.StatusSeeOther, "http://localhost:5173/payment/failure")
        return
    }

    if IDCliente <= 0 {
		c.Redirect(http.StatusSeeOther, "http://localhost:5173/payment/failure")
		return
	}

	cart, items, err := pu.CartRepo.GetCartItems(IDCliente)
	if err != nil {
		c.Redirect(http.StatusSeeOther, "http://localhost:5173/payment/failure")
		return
	}
	if cart == nil {
		c.Redirect(http.StatusSeeOther, "http://localhost:5173/payment/failure")
		return
	}

	// Construir detalles desde los items del carrito y calcular total
	var detalles []domain.DetalleVenta
	var total float64
	for _, it := range items {
		detalles = append(detalles, domain.DetalleVenta{
			IDProducto: it.IDProducto,
			Cantidad:   it.Cantidad,
			PrecioUnit: it.PrecioUnit,
		})
		total += float64(it.Cantidad) * it.PrecioUnit
	}

	venta := domain.Venta{
		IDCliente:         IDCliente,
		IDCarrito:         cart.IDCart,
		IDDireccion:       IDDireccion,
		FechaPedido:       time.Now(),
		Total:             total,
		Estado:            "PAGADO",
		FormaDePago:       paymentType,
		CondicionesDePago: "Pago Completo",
	}


	if err := pu.SaleRepo.CreateSale(&venta, detalles); err != nil {
        c.Redirect(http.StatusSeeOther, "http://localhost:5173/payment/failure")
		return
	}


	c.Redirect(http.StatusSeeOther, fmt.Sprintf("http://localhost:5173/payment/success?order_id=%d", venta.IDVenta))
}
