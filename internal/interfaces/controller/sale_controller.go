package controller

import (
	"github.com/SebaVCH/ERPBackendVentas/internal/usecase"
	"github.com/gin-gonic/gin"
)

type SaleController struct {
	SaleUseCase usecase.SaleUsecase
}

func NewSaleController(saleUseCase usecase.SaleUsecase) *SaleController {
	return &SaleController{
		SaleUseCase: saleUseCase,
	}
}

func (sc *SaleController) GetSales(c *gin.Context) {
	sc.SaleUseCase.GetSales(c)
}

func (sc *SaleController) CreateSale(c *gin.Context) {
	sc.SaleUseCase.CreateSale(c)
}

func (sc *SaleController) GetSale(c *gin.Context) {
	sc.SaleUseCase.GetSale(c)
}

func (sc *SaleController) GetSalesDetails(c *gin.Context) {
	sc.SaleUseCase.GetSalesDetails(c)
}