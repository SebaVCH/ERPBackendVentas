package controller

import (
    "github.com/SebaVCH/ERPBackendVentas/internal/usecase"
    "github.com/gin-gonic/gin"
)

type PaymentController struct {
    PaymentUseCase usecase.PaymentUsecase
}

func NewPaymentController(pu usecase.PaymentUsecase) *PaymentController {
    return &PaymentController{PaymentUseCase: pu}
}

func (pc *PaymentController) CreateCheckout(c *gin.Context) {
    pc.PaymentUseCase.CreateCheckout(c)
}
