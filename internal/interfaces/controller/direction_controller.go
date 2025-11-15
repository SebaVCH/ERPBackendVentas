package controller

import (
	"github.com/SebaVCH/ERPBackendVentas/internal/usecase"
	"github.com/gin-gonic/gin"
)

type DirectionController struct {
	DirectionUsecase usecase.DirectionUsecase
}

func NewDirectionController(directionUsecase usecase.DirectionUsecase) *DirectionController {
	return &DirectionController{
		DirectionUsecase: directionUsecase,
	}
}

func (dc *DirectionController) CreateDirection(c *gin.Context) {
	dc.DirectionUsecase.CreateDirection(c)
}

func (dc *DirectionController) GetDirections(c *gin.Context) {
	dc.DirectionUsecase.GetDirections(c)
}
