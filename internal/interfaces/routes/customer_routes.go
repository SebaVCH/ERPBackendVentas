package routes

import (
	"github.com/SebaVCH/ERPBackendVentas/internal/interfaces/controller"
	"github.com/SebaVCH/ERPBackendVentas/internal/repository"
	"github.com/SebaVCH/ERPBackendVentas/internal/usecase"
	"github.com/gin-gonic/gin"
)

func SetupCustomerRoutes(r *gin.Engine) {
	customerRepo := repository.NewCustomerRepository()
	customerUseCase := usecase.NewCustomerUseCase(customerRepo)
	customerController := controller.NewCustomerController(customerUseCase)

	r.GET("/clientes", customerController.GetCustomers)
}
