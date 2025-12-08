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
	cartRepo := repository.NewCartRepository()
	saleRepo := repository.NewSaleRepository()
	customerRepo := repository.NewCustomerRepository()
	directionRepo := repository.NewDirectionRepository()
	payUsecase := usecase.NewPaymentUsecase(payRepo, cartRepo, saleRepo, customerRepo, directionRepo)
	payController := controller.NewPaymentController(payUsecase)

	rg.POST("/payments/checkout", payController.CreateCheckout)
	rg.GET("/payments/success", payController.PaymentSuccess)
	rg.GET("/payments/pending", payController.PaymentPending)
	rg.GET("/payments/failure", payController.PaymentFailure)
}
