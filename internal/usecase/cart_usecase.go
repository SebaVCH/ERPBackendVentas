package usecase

import (
	"net/http"
	"github.com/SebaVCH/ERPBackendVentas/internal/domain"
	"github.com/SebaVCH/ERPBackendVentas/internal/repository"
	"github.com/gin-gonic/gin"
	"time"
)
type CartUseCase interface {
	GetCartItems(c *gin.Context)
	AddCartItem(c *gin.Context)
	RemoveCartItem(c *gin.Context)
	ClearCart(c *gin.Context)
}

type cartUseCase struct {
	cartRepo repository.CartRepository
}

func NewCartUseCase(cartRepo repository.CartRepository) CartUseCase {
	return &cartUseCase{
		cartRepo: cartRepo,
	}
}

