package routes

import (
	"github.com/SebaVCH/ERPBackendVentas/internal/interfaces/controller"
	"github.com/SebaVCH/ERPBackendVentas/internal/repository"
	"github.com/SebaVCH/ERPBackendVentas/internal/usecase"
	"github.com/gin-gonic/gin"
)

func SetupCartRoutes(r *gin.Engine) {
	cartRepo := repository.NewCartRepository()
	cartUseCase := usecase.NewCartUseCase(cartRepo)
	cartController := controller.NewCartController(cartUseCase)

	r.POST("/cart", cartController.CreateCart)
	r.GET("/cart/item/:clientID", cartController.GetCartItems)
	r.POST("/cart/item", cartController.AddCartItem)
	r.PUT("/cart/item/remove", cartController.RemoveCartItem)
	r.DELETE("/cart/clear", cartController.ClearCart)
}
