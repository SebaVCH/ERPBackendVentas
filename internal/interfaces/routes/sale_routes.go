package routes

import (
	"github.com/SebaVCH/ERPBackendVentas/internal/handlers"
	"github.com/SebaVCH/ERPBackendVentas/internal/repository"
	"github.com/SebaVCH/ERPBackendVentas/internal/usecase"
	"github.com/gin-gonic/gin"
)

func SetupSaleRoutes(rg *gin.Engine) {

	repo := repository.NewSaleRepository()
	uc := usecase.NewSaleUsecase(repo)
	handler := handlers.NewSaleHandler(uc)

	sales := rg.Group("/sales")
	{
		sales.POST("", handler.CreateSale) // POST /api/sales
		sales.GET("", handler.GetSales)    // GET  /api/sales
		sales.GET("/:id", handler.GetSale) // GET  /api/sales/:id
	}
}
