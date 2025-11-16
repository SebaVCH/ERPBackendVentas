package usecase

import (
    "net/http"
    "strconv"

    "github.com/SebaVCH/ERPBackendVentas/internal/repository"
    "github.com/gin-gonic/gin"
)

type PaymentUsecase interface {
    CreateCheckout(c *gin.Context)
}

type paymentUsecase struct {
    PayRepo repository.PaymentRepository
}

func NewPaymentUsecase(payRepo repository.PaymentRepository) PaymentUsecase {
    return &paymentUsecase{PayRepo: payRepo}
}

type CreateCheckoutRequest struct {
    IDCliente int     `json:"id_cliente" binding:"required"`
    Amount    float64 `json:"amount" binding:"required"`
    Title     string  `json:"title"`
}

func (pu *paymentUsecase) CreateCheckout(c *gin.Context) {
    var req CreateCheckoutRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "request inválido", "error": err.Error()})
        return
    }

    externalRef := "cliente_" + strconv.FormatInt(int64(req.IDCliente), 10)

    initPoint, prefID, err := pu.PayRepo.CreatePreference(req.Amount, req.Title, externalRef)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "error creando preference", "error": err.Error()})
        return
    }

    c.JSON(http.StatusCreated, gin.H{
        "success": true,
        "message": "preference creada",
        "data": gin.H{"init_point": initPoint, "preference_id": prefID},
    })
}
