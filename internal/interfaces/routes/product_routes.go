package routes

import (
	"github.com/SebaVCH/ERPBackendVentas/internal/interfaces/controller"
	"github.com/SebaVCH/ERPBackendVentas/internal/repository"
	"github.com/SebaVCH/ERPBackendVentas/internal/usecase"
	"github.com/gin-gonic/gin"
)

func SetupProductRoutes(rg *gin.Engine) {
	repo := repository.NewProductRepository()
	uc := usecase.NewProductUsecase(repo)
	ctrl := controller.NewProductController(uc)

	rg.GET("/products", ctrl.GetProducts)
}
