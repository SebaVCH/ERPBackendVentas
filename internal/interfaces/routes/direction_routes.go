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

	rg.POST("/direction", directionController.CreateDirection)
	rg.GET("/direction", directionController.GetDirections)
	rg.GET("/direction/:clientID", directionController.GetDirectionsByClientID)
	rg.PUT("/direction/:id", directionController.UpdateDirection)
	rg.DELETE("/direction/:id", directionController.DeleteDirection)
}
