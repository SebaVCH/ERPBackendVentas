package usecase

import (
	"net/http"
	"strconv"
	"time"

	"github.com/SebaVCH/ERPBackendVentas/internal/domain"
	"github.com/SebaVCH/ERPBackendVentas/internal/repository"
	"github.com/gin-gonic/gin"
)

type SaleUsecase interface {
	CreateSale(c *gin.Context)
	GetSales(c *gin.Context)
	GetSale(c *gin.Context)
	GetSalesDetails(c *gin.Context)
}

type saleUsecase struct {
	SaleRepo repository.SaleRepository
	CartRepo repository.CartRepository
}

func NewSaleUseCase(saleRepo repository.SaleRepository, cartRepo repository.CartRepository) SaleUsecase {
	return &saleUsecase{
		SaleRepo: saleRepo,
		CartRepo: cartRepo,
	}
}

type CreateSaleRequest struct {
	IDCliente         int    `json:"id_cliente" `
	IDDireccion       int    `json:"id_direccion" `
	FormaDePago       string `json:"forma_de_pago" `
	CondicionesDePago string `json:"condiciones_de_pago" `
}

func (u *saleUsecase) CreateSale(ctx *gin.Context) {

	var req CreateSaleRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		respondJSON(ctx, http.StatusBadRequest, APIResponse{
			Success: false,
			Message: "request invalido",
			Error:   err.Error(),
		})
		return
	}

	if req.IDCliente <= 0 {
		respondJSON(ctx, http.StatusBadRequest, APIResponse{
			Success: false,
			Message: "id_cliente debe ser mayor a 0",
		})
		return
	}

	cart, items, err := u.CartRepo.GetCartItems(req.IDCliente)
	if err != nil {
		respondJSON(ctx, http.StatusInternalServerError, APIResponse{
			Success: false,
			Message: "error al obtener carrito y items",
			Error:   err.Error(),
		})
		return
	}
	if cart == nil {
		respondJSON(ctx, http.StatusBadRequest, APIResponse{
			Success: false,
			Message: "carrito activo del cliente no encontrado",
		})
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
		IDCliente:         req.IDCliente,
		IDCarrito:         cart.IDCart,
		IDDireccion:       req.IDDireccion,
		FechaPedido:       time.Now(),
		Total:             total,
		Estado:            "PAGADO",
		FormaDePago:       req.FormaDePago,
		CondicionesDePago: req.CondicionesDePago,
	}

	if err := u.SaleRepo.CreateSale(&venta, detalles); err != nil {
		respondJSON(ctx, http.StatusInternalServerError, APIResponse{
			Success: false,
			Message: "error al crear la venta",
			Error:   err.Error(),
		})
		return
	}

	fullSale, err := u.SaleRepo.GetSale(venta.IDVenta)
	if err != nil {
		respondJSON(ctx, http.StatusCreated, APIResponse{
			Success: true,
			Message: "venta creada, no se pudieron cargar relaciones",
			Data:    venta,
		})
		return
	}

	respondJSON(ctx, http.StatusCreated, APIResponse{
		Success: true,
		Message: "venta creada exitosamente",
		Data:    fullSale,
	})
}

func (su *saleUsecase) GetSales(c *gin.Context) {
	sales, err := su.SaleRepo.GetSales()
	if err != nil {
		respondJSON(c, http.StatusInternalServerError, APIResponse{
			Success: false,
			Message: "Error al obtener las ventas",
			Error:   err.Error(),
		})
		return
	}
	respondJSON(c, http.StatusOK, APIResponse{
		Success: true,
		Message: "ventas obtenidas exitosamente",
		Data:    sales,
	})
}

func (su *saleUsecase) GetSale(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		respondJSON(c, http.StatusBadRequest, APIResponse{
			Success: false,
			Message: "id inválido",
			Error:   "id debe ser numérico",
		})
		return
	}

	sale, err := su.SaleRepo.GetSale(id)
	if err != nil {
		respondJSON(c, http.StatusNotFound, APIResponse{
			Success: false,
			Message: "Venta no encontrada",
			Error:   err.Error(),
		})
		return
	}
	respondJSON(c, http.StatusOK, APIResponse{
		Success: true,
		Message: "venta obtenida exitosamente",
		Data:    sale,
	})
}


// GetSalesDetails implements SaleUsecase.
func (u *saleUsecase) GetSalesDetails(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		respondJSON(c, http.StatusBadRequest, APIResponse{
			Success: false,
			Message: "id inválido",
			Error:   "id debe ser numérico",
		})
		return
	}
	detallesVenta, err := u.SaleRepo.GetSalesDetails(id)
	if err != nil {
		respondJSON(c, http.StatusInternalServerError, APIResponse{
			Success: false,
			Message: "error a obtener detalles ventas",
			Error: err.Error(),
		})
		return 
	}

	respondJSON(c, http.StatusOK, APIResponse{
		Success: true,
		Message: "OK",
		Data: detallesVenta,
	})
}