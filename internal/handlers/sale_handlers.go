package handlers

import (
    "net/http"
    "time"

    "github.com/SebaVCH/ERPBackendVentas/internal/domain"
    "github.com/SebaVCH/ERPBackendVentas/internal/usecase"

    "github.com/gin-gonic/gin"
)

type DetalleReq struct {
    IDProducto     int     `json:"id_producto" binding:"required"`
    Cantidad       int     `json:"cantidad" binding:"required"`
    PrecioUnitario float64 `json:"precio_unitario"` // opcional, si 0 se usa precio del producto
}

type CreateSaleReq struct {
    IDCliente         int          `json:"id_cliente" binding:"required"`
    IDEmpleado        int          `json:"id_empleado" binding:"required"`
    FechaPedido       *time.Time   `json:"fecha_pedido"`
    FormaDePago       string       `json:"forma_de_pago" binding:"required"`
    CondicionesDePago string       `json:"condiciones_de_pago" binding:"required"`
    DetallesVenta     []DetalleReq `json:"detalles_venta" binding:"required,dive"`
}

type SaleHandler struct {
    su usecase.SaleUsecase
}

func NewSaleHandler(su usecase.SaleUsecase) *SaleHandler{
	return &SaleHandler{su: su}
}

func (h *SaleHandler) CreateSale(c *gin.Context) {
    var req CreateSaleReq
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    fecha := time.Now()
    if req.FechaPedido != nil {
        fecha = *req.FechaPedido
    }

    detalles := make([]domain.DetalleVenta, 0, len(req.DetallesVenta))
    for _, d := range req.DetallesVenta {
        detalles = append(detalles, domain.DetalleVenta{
            IDProducto: d.IDProducto,
            Cantidad:   d.Cantidad,
            PrecioUnit: d.PrecioUnitario,
        })
    }

	venta := &domain.Ventas{
        IDCliente:         req.IDCliente,
        IDEmpleado:        req.IDEmpleado,
        FechaPedido:       fecha,
        Estado:            ptrBool(true),
        FormaDePago:       req.FormaDePago,
        CondicionesDePago: req.CondicionesDePago,
        DetallesVenta:     detalles,
    }

    created, err := h.su.CreateSale(c.Request.Context(), venta)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusCreated, created)
}

func (h *SaleHandler) GetSales(c *gin.Context) {
    ventas, err := h.su.GetSales(c.Request.Context())
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusOK, ventas)
}

func (h *SaleHandler) GetSale(c *gin.Context) {
    idParam := c.Param("id")
   
    if _, err := fmt.Sscanf(idParam, "%d", &id); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "id inválido"})
        return
    }
    venta, err := h.su.GetSale(c.Request.Context(), id)
    if err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusOK, venta)
}

func ptrBool(b bool) *bool { return &b }