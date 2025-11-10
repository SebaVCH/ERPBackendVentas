package usecase

import (
	"net/http"
	"strconv"
	"time"

	"github.com/SebaVCH/ERPBackendVentas/internal/domain"
	"github.com/SebaVCH/ERPBackendVentas/internal/repository"
	"github.com/gin-gonic/gin"
)

type DetalleReq struct {
	IDProducto     int     `json:"id_producto" binding:"required"`
	Cantidad       int     `json:"cantidad" binding:"required"`
	PrecioUnitario float64 `json:"precio_unitario" binding:"required"`
}

type CreateSaleReq struct {
	IDCliente         int          `json:"id_cliente" binding:"required"`
	FechaPedido       *time.Time   `json:"fecha_pedido"`
	FormaDePago       string       `json:"forma_de_pago" binding:"required"`
	Estado			string       `json:"estado" binding:"required"`
	DireccionEnvio    string       `json:"direccion_envio" binding:"required"`
	CondicionesDePago string       `json:"condiciones_de_pago" binding:"required"`
	DetallesVenta     []DetalleReq `json:"detalles_venta" binding:"required,dive"`
}

type SaleUsecase interface {
	CreateSale(c *gin.Context)
	GetSales(c *gin.Context)
	GetSale(c *gin.Context)
}

type saleUsecase struct {
	SaleRepo repository.SaleRepository
}

func NewSaleUseCase(saleRepo repository.SaleRepository) SaleUsecase {
	return &saleUsecase{
		SaleRepo: saleRepo,
	}
}

func (su *saleUsecase) CreateSale(c *gin.Context) {
	var req CreateSaleReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if len(req.DetallesVenta) == 0 {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "debe incluir al menos un detalle de venta"})
		return
	}

	for _, d := range req.DetallesVenta {
		if d.Cantidad <= 0 {
			c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "cantidad debe ser mayor a 0"})
			return
		}
		if d.PrecioUnitario <= 0 {
			c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "precio unitario debe ser mayor a 0"})
			return
		}
	}

	fecha := time.Now()
	if req.FechaPedido != nil {
		fecha = *req.FechaPedido
	}

	detalles := make([]domain.DetalleVenta, 0, len(req.DetallesVenta))

	var total float64
	for _, d := range req.DetallesVenta {

		if d.Cantidad >= su.SaleRepo.GetProductQuantity(d.IDProducto) {
			c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "cantidad solicitada supera el stock disponible"})
			return
		}

		detalles = append(detalles, domain.DetalleVenta{
			IDProducto: d.IDProducto,
			Cantidad:   d.Cantidad,
			PrecioUnit: d.PrecioUnitario,
		})
		total += float64(d.Cantidad) * d.PrecioUnitario
	}

	venta := &domain.Venta{
		IDCliente:         req.IDCliente,
		FechaPedido:       fecha,
		Total:             total,
		Estado:            req.Estado,
		DireccionEnvio:    req.DireccionEnvio,
		FormaDePago:       req.FormaDePago,
		CondicionesDePago: req.CondicionesDePago,
		DetallesVenta:     detalles,
	}

	created, err := su.SaleRepo.CreateSale(venta)
	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.IndentedJSON(http.StatusCreated, created)
}

func (su *saleUsecase) GetSales(c *gin.Context) {
	sales, err := su.SaleRepo.GetSales()
	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": "Error al obtener las ventas"})
		return
	}
	c.IndentedJSON(http.StatusOK, sales)
}

func (su *saleUsecase) GetSale(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "id inválido"})
		return
	}

	sale, err := su.SaleRepo.GetSale(id)
	if err != nil {
		c.IndentedJSON(http.StatusNotFound, gin.H{"error": "Venta no encontrada"})
		return
	}
	c.IndentedJSON(http.StatusOK, sale)
}

func ptrBool(b bool) *bool {
	return &b
}
