package routes

import (
	"github.com/SebaVCH/ERPBackendVentas/internal/interfaces/middleware"
	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	router := gin.Default()
	router.Use(middleware.CORSMiddleware())
	protected := router.Group("")
	protected.Use(middleware.JWTMiddleware())
	SetupCustomerRoutes(router,protected)
	SetupSaleRoutes(router)
	SetupCartRoutes(router)
	SetupDirectionRoutes(router)
	SetupAuthRoutes(router)
	SetupPaymentRoutes(router)

	return router
}
