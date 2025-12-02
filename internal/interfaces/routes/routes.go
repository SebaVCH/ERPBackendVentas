package routes

import (
	"github.com/SebaVCH/ERPBackendVentas/internal/interfaces/middleware"
	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	router := gin.Default()
	router.Use(middleware.CORSMiddleware())

	SetupCustomerRoutes(router)
	SetupSaleRoutes(router)
	SetupCartRoutes(router)
	SetupDirectionRoutes(router)
	SetupPaymentRoutes(router)

	return router
}
