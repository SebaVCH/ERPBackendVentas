package routes

import (
	"github.com/SebaVCH/ERPBackendVentas/internal/interfaces/controller"
	"github.com/SebaVCH/ERPBackendVentas/internal/repository"
	"github.com/SebaVCH/ERPBackendVentas/internal/usecase"
	"github.com/gin-gonic/gin"
)

func SetupEmployeeRoutes(rg *gin.Engine) {
	employeeRepo := repository.NewEmployeeRepository()
	employeeUsecase := usecase.NewEmployeeUsecase(employeeRepo)
	employeeController := controller.NewEmployeeController(employeeUsecase)

	rg.POST("/employee/login", employeeController.LoginEmployee)            // POST /employee/login
	rg.POST("/employee/register", employeeController.RegisterEmployee)      // POST /employee/register
	rg.GET("/employee/rut/:rut", employeeController.GetEmployeeByRut)       // GET  /employee/rut/:rut
	rg.GET("/employee/email/:email", employeeController.GetEmployeeByEmail) // GET  /employee/email/:email
}
