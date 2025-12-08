package controller

import (
	"github.com/SebaVCH/ERPBackendVentas/internal/usecase"
	"github.com/gin-gonic/gin"
)

type ProductController struct {
	ProductUseCase usecase.ProductUseCase
}

func NewProductController(productUseCase usecase.ProductUseCase) *ProductController {
	return &ProductController{
		ProductUseCase: productUseCase,
	}
}

func (cu *ProductController) GetProducts(c *gin.Context) {
	cu.ProductUseCase.GetProducts(c)
}
