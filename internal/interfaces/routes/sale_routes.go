package routes

import (
    "github.com/SebaVCH/ERPBackendVentas/internal/handlers"
    "github.com/SebaVCH/ERPBackendVentas/internal/usecase"
    "github.com/gin-gonic/gin"
)

func RegisterSaleRoutes(rg *gin.RouterGroup, su usecase.SaleUsecase) {
    h := handlers.NewSaleHandler(su)

    sales := rg.Group("/sales")
    {
        sales.POST("", h.CreateSale)   // POST /api/sales
        sales.GET("", h.GetSales)      // GET  /api/sales
        sales.GET("/:id", h.GetSale)   // GET  /api/sales/:id
    }
}