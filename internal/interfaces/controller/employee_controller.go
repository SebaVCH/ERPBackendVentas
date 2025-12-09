package controller

import (
	"github.com/SebaVCH/ERPBackendVentas/internal/usecase"
	"github.com/gin-gonic/gin"
)

type EmployeeController struct {
	EmployeeUsecase usecase.EmployeeUsecase
}

func NewEmployeeController(employeeUsecase usecase.EmployeeUsecase) *EmployeeController {
	return &EmployeeController{
		EmployeeUsecase: employeeUsecase,
	}
}

func (ec *EmployeeController) LoginEmployee(ctx *gin.Context) {
	ec.EmployeeUsecase.LoginEmployee(ctx)
}

func (ec *EmployeeController) RegisterEmployee(ctx *gin.Context) {
	ec.EmployeeUsecase.RegisterEmployee(ctx)
}

func (ec *EmployeeController) GetEmployeeByRut(ctx *gin.Context) {
	ec.EmployeeUsecase.GetEmployeeByRut(ctx)
}

func (ec *EmployeeController) GetEmployeeByEmail(ctx *gin.Context) {
	ec.EmployeeUsecase.GetEmployeeByEmail(ctx)
}
