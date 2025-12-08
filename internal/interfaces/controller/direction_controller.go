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

func (dc *DirectionController) GetDirectionByID(c *gin.Context) {
	dc.DirectionUsecase.GetDirectionByID(c)
}

func (dc *DirectionController) GetDirectionsByClientID(c *gin.Context) {
	dc.DirectionUsecase.GetDirectionsByClientID(c)
}

func (dc *DirectionController) UpdateDirection(c *gin.Context) {
	dc.DirectionUsecase.UpdateDirection(c)
}

func (dc *DirectionController) DeleteDirection(c *gin.Context) {
	dc.DirectionUsecase.DeleteDirection(c)
}

func (dc *DirectionController) CreateMany(c *gin.Context) {
	dc.DirectionUsecase.CreateMany(c)
}
