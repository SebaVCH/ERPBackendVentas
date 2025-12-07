package routes

import (
	"github.com/SebaVCH/ERPBackendVentas/internal/interfaces/controller"
	"github.com/SebaVCH/ERPBackendVentas/internal/repository"
	"github.com/SebaVCH/ERPBackendVentas/internal/usecase"
	"github.com/gin-gonic/gin"
)

func SetupDirectionRoutes(rg *gin.Engine) {
	directionRepo := repository.NewDirectionRepository()
	directionUsecase := usecase.NewDirectionUsecase(directionRepo)
	directionController := controller.NewDirectionController(directionUsecase)

	rg.POST("/directions", directionController.CreateDirection)
	rg.GET("/directions", directionController.GetDirections)
	rg.GET("/directions/:id", directionController.GetDirectionByID)
	rg.GET("/clientes/:id/directions", directionController.GetDirectionsByClientID) // id -> id_cliente
	rg.PUT("/directions/:id", directionController.UpdateDirection)
	rg.DELETE("/directions/:id", directionController.DeleteDirection)
}
