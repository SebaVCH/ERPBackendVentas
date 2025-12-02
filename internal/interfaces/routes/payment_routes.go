package routes

import (
    "github.com/SebaVCH/ERPBackendVentas/internal/interfaces/controller"
    "github.com/SebaVCH/ERPBackendVentas/internal/repository"
    "github.com/SebaVCH/ERPBackendVentas/internal/usecase"
    "github.com/gin-gonic/gin"
)

func SetupPaymentRoutes(rg *gin.Engine) {
    payRepo := repository.NewPaymentRepository()
    payUsecase := usecase.NewPaymentUsecase(payRepo)
    payController := controller.NewPaymentController(payUsecase)

    rg.POST("/payments/checkout", payController.CreateCheckout)
}
