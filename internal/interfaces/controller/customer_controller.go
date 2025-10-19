package controller

import (
	"github.com/SebaVCH/ERPBackendVentas/internal/usecase"
	"github.com/gin-gonic/gin"
)

type CustomerController struct {
	CustomerUseCase usecase.CustomerUseCase
}

func NewCustomerController(customerUseCase usecase.CustomerUseCase) *CustomerController {
	return &CustomerController{
		CustomerUseCase: customerUseCase,
	}
}

func (cu *CustomerController) GetCustomers(c *gin.Context) {
	cu.CustomerUseCase.GetCustomers(c)
}
