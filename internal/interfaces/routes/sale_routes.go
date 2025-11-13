package routes

import (
	"github.com/SebaVCH/ERPBackendVentas/internal/interfaces/controller"
	"github.com/SebaVCH/ERPBackendVentas/internal/repository"
	"github.com/SebaVCH/ERPBackendVentas/internal/usecase"
	"github.com/gin-gonic/gin"
)

func SetupSaleRoutes(rg *gin.Engine) {
	saleRepo := repository.NewSaleRepository()
	cartRepo := repository.NewCartRepository()
	saleUseCase := usecase.NewSaleUseCase(saleRepo, cartRepo)
	saleController := controller.NewSaleController(saleUseCase)

	rg.POST("/sales", saleController.CreateSale) // POST /api/sales
	rg.GET("/sales", saleController.GetSales)    // GET  /api/sales
	rg.GET("/sales/:id", saleController.GetSale) // GET  /api/sales/:id

}
