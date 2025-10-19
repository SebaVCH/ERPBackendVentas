package usecase

import (
	"net/http"

	"github.com/SebaVCH/ERPBackendVentas/internal/repository"
	"github.com/gin-gonic/gin"
)

type CustomerUseCase interface {
	GetCustomers(c *gin.Context)
}

type customerUseCase struct {
	CustomerRepo repository.CustomerRepository
}

func NewCustomerUseCase(customerRepo repository.CustomerRepository) CustomerUseCase {
	return &customerUseCase{
		CustomerRepo: customerRepo,
	}
}

func (cu customerUseCase) GetCustomers(c *gin.Context) {
	customers, err := cu.CustomerRepo.GetCustomers()
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Error al obtener los clientes"})
		return
	}
	c.IndentedJSON(http.StatusOK, customers)
}
