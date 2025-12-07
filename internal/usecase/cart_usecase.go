package usecase

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/SebaVCH/ERPBackendVentas/internal/domain"
	"github.com/SebaVCH/ERPBackendVentas/internal/repository"
	"github.com/gin-gonic/gin"
)

type CartUseCase interface {
	CreateCart(c *gin.Context)
	GetCartItems(c *gin.Context)
	AddCartItem(c *gin.Context)
	RemoveCartItem(c *gin.Context)
	ClearCart(c *gin.Context)
	ReserveSaleStock(c *gin.Context)
	VerifyCartItems(c *gin.Context) (domain.CarritoProducto, int, error)
}

type cartUseCase struct {
	CartRepo repository.CartRepository
}

func NewCartUseCase(cartRepo repository.CartRepository) CartUseCase {
	return &cartUseCase{
		CartRepo: cartRepo,
	}
}

type GeneralCartItemRequest struct {
	IDCliente   int     `json:"id_cliente"`
	IDProducto  int     `json:"id_producto"`
	Cantidad    int     `json:"cantidad"`
	PrecioVenta float64 `json:"precio_venta"`
}

type CreateCartRequest struct {
	IDCliente int `json:"id_cliente"`
}

type APIResponse struct {
	Success bool        `json:"success"`
	Message string      `json:"message,omitempty"`
	Error   string      `json:"error,omitempty"`
	Data    interface{} `json:"data,omitempty"`
}

type ReserveStockRequest struct {
	IDCliente int `json:"id_cliente"`
}

// Esto lo cree para tener un formato de respuesta uniforme
func respondJSON(ctx *gin.Context, status int, resp APIResponse) {
	ctx.JSON(status, resp)
}

func (c *cartUseCase) ReserveSaleStock(ctx *gin.Context) {
	var req ReserveStockRequest
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
			Message: "IDCliente invalido",
			Error:   "El id del cliente debe ser mayor a 0",
		})
		return
	}

	err := c.CartRepo.ReserveSaleStock(req.IDCliente)
	if err != nil {
		respondJSON(ctx, http.StatusInternalServerError, APIResponse{
			Success: false,
			Message: "error al reservar el stock para la venta",
			Error:   err.Error(),
		})
		return
	}
	respondJSON(ctx, http.StatusOK, APIResponse{
		Success: true,
		Message: "stock reservado exitosamente para la venta",
	})
}

func (c *cartUseCase) CreateCart(ctx *gin.Context) {
	var req CreateCartRequest
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
			Message: "IDCliente invalido",
			Error:   "El id del cliente debe ser mayor a 0",
		})
		return
	}

	cart, err := c.CartRepo.CreateCart(req.IDCliente)
	if err != nil {
		respondJSON(ctx, http.StatusInternalServerError, APIResponse{
			Success: false,
			Message: "error al crear el carrito",
			Error:   err.Error(),
		})
		return
	}
	respondJSON(ctx, http.StatusCreated, APIResponse{
		Success: true,
		Message: "carrito creado exitosamente",
		Data:    cart,
	})
}

func (c *cartUseCase) GetCartItems(ctx *gin.Context) {

	idStr := ctx.Param("clientID")
	id, err := strconv.Atoi(idStr)
	if err != nil || id <= 0 {
		respondJSON(ctx, http.StatusBadRequest, APIResponse{
			Success: false,
			Message: "id_cliente inválido",
			Error:   "se requiere un id_numérico mayor a 0"})
		return
	}

	cart, cartProducts, err := c.CartRepo.GetCartItems(id)
	if err != nil {
		respondJSON(ctx, http.StatusInternalServerError, APIResponse{
			Success: false,
			Message: "error al obtener los items del carrito",
			Error:   err.Error(),
		})
		return
	}

	respondJSON(ctx, http.StatusOK, APIResponse{
		Success: true,
		Message: "items del carrito obtenidos exitosamente",
		Data: gin.H{
			"cart":          cart,
			"cart_products": cartProducts,
		},
	})
}

func (c *cartUseCase) AddCartItem(ctx *gin.Context) {

	cartProduct, idCliente, err := c.VerifyCartItems(ctx)
	if err != nil {
		return
	}
	err = c.CartRepo.AddCartItem(idCliente, cartProduct)
	if err != nil {
		respondJSON(ctx, http.StatusInternalServerError, APIResponse{
			Success: false,
			Message: "error al agregar el producto al carrito",
			Error:   err.Error(),
		})
		return
	}

	respondJSON(ctx, http.StatusOK, APIResponse{
		Success: true,
		Message: "producto agregado al carrito exitosamente",
	})
}

func (c *cartUseCase) RemoveCartItem(ctx *gin.Context) {

	elemento, idCliente, err := c.VerifyCartItems(ctx)
	if err != nil {
		return
	}

	err = c.CartRepo.RemoveCartItem(idCliente, elemento)
	if err != nil {
		respondJSON(ctx, http.StatusInternalServerError, APIResponse{
			Success: false,
			Message: "error al remover el producto del carrito",
			Error:   err.Error(),
		})
		return
	}

	respondJSON(ctx, http.StatusOK, APIResponse{
		Success: true,
		Message: "producto removido del carrito exitosamente",
	})
}

func (c *cartUseCase) ClearCart(ctx *gin.Context) {
	// falta implementacion
}

// Funcion auxiliar para verificar los items del carrito
func (c *cartUseCase) VerifyCartItems(ctx *gin.Context) (domain.CarritoProducto, int, error) {

	var req GeneralCartItemRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		respondJSON(ctx, http.StatusBadRequest, APIResponse{
			Success: false,
			Message: "request invalido",
			Error:   err.Error(),
		})
		return domain.CarritoProducto{}, 0, errors.New("request invalido")
	}

	if req.IDCliente <= 0 || req.IDProducto <= 0 || req.Cantidad <= 0 || req.PrecioVenta <= 0 {
		respondJSON(ctx, http.StatusBadRequest, APIResponse{
			Success: false,
			Message: "datos del producto invalidos",
			Error:   "IDProducto, IDCliente, Cantidad y PrecioVenta deben ser mayores a 0",
		})
		return domain.CarritoProducto{}, 0, errors.New("datos del producto invalidos")
	}

	// de aca saco el carrito activo del cliente
	cart, _, err := c.CartRepo.GetCartItems(req.IDCliente)
	if err != nil {
		respondJSON(ctx, http.StatusNotFound, APIResponse{
			Success: false,
			Message: "carrito activo no encontrado",
			Error:   err.Error(),
		})
		return domain.CarritoProducto{}, 0, errors.New("carrito activo no encontrado")
	}

	cartProduct := domain.CarritoProducto{
		IDCart:      cart.IDCart,
		IDProducto:  req.IDProducto,
		Cantidad:    req.Cantidad,
		PrecioVenta: req.PrecioVenta,
	}

	return cartProduct, req.IDCliente, nil
}
