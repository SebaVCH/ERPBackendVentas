package controller

import (
	"github.com/SebaVCH/ERPBackendVentas/internal/usecase"
	"github.com/gin-gonic/gin"
)

type CartController struct {
	CartUseCase usecase.CartUseCase
}

func NewCartController(cartUseCase usecase.CartUseCase) *CartController {
	return &CartController{
		CartUseCase: cartUseCase,
	}
}

func (cc *CartController) CreateCart(c *gin.Context) {
	cc.CartUseCase.CreateCart(c)
}

func (cc *CartController) GetCartItems(c *gin.Context) {
	cc.CartUseCase.GetCartItems(c)
}

func (cc *CartController) AddCartItem(c *gin.Context) {
	cc.CartUseCase.AddCartItem(c)
}

func (cc *CartController) RemoveCartItem(c *gin.Context) {
	cc.CartUseCase.RemoveCartItem(c)
}

func (cc *CartController) ClearCart(c *gin.Context) {
	cc.CartUseCase.ClearCart(c)
}
