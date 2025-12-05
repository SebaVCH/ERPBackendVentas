package routes

import (
	"encoding/json"
	"net/http"

	"github.com/SebaVCH/ERPBackendVentas/internal/interfaces/controller"
	"github.com/SebaVCH/ERPBackendVentas/internal/repository"
	"github.com/SebaVCH/ERPBackendVentas/internal/usecase"
	"github.com/gin-gonic/gin"
)

func GetDefault(c *gin.Context) {
	jsonData := []byte(`{"msg":"this worked"}`)

	var v interface{}
	json.Unmarshal(jsonData, &v)
	data := v.(map[string]interface{})

	c.JSON(http.StatusOK, data)
}

func SetupPaymentRoutes(rg *gin.Engine) {
	payRepo := repository.NewPaymentRepository()
	payUsecase := usecase.NewPaymentUsecase(payRepo)
	payController := controller.NewPaymentController(payUsecase)

	rg.POST("/payments/checkout", payController.CreateCheckout)
	rg.GET("/payments/success", GetDefault)
    rg.GET("/payments/pending", GetDefault)
    rg.GET("/payments/failure", GetDefault)
}
