package routes

import (
	"github.com/SebaVCH/ERPBackendVentas/internal/interfaces/controller"
	"github.com/SebaVCH/ERPBackendVentas/internal/repository"
	"github.com/SebaVCH/ERPBackendVentas/internal/usecase"
	"github.com/gin-gonic/gin"
)

func SetupCustomerRoutes(r *gin.Engine) {
	customerRepo := repository.NewCustomerRepository()
	salesRepo := repository.NewSaleRepository()
	cartRepo := repository.NewCartRepository()
	customerUseCase := usecase.NewCustomerUseCase(customerRepo, salesRepo, cartRepo)
	customerController := controller.NewCustomerController(customerUseCase)

	r.GET("/clientes", customerController.GetCustomers)
	r.GET("/clientes/:id", customerController.GetCustomerByID)
	r.POST("/clientes/send_email", customerController.SendEmail)
}
