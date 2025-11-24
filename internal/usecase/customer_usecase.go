package usecase

import (
	"net/http"

	"github.com/SebaVCH/ERPBackendVentas/internal/domain"
	"github.com/SebaVCH/ERPBackendVentas/internal/repository"
	"github.com/SebaVCH/ERPBackendVentas/internal/utils"
	"github.com/gin-gonic/gin"
)

type CustomerUseCase interface {
	GetCustomers(c *gin.Context)
}

type customerUseCase struct {
	CustomerRepo repository.CustomerRepository
	SalesRepo    repository.SaleRepository
	CartRepo     repository.CartRepository
}

func NewCustomerUseCase(customerRepo repository.CustomerRepository, salesRepo repository.SaleRepository, cartRepo repository.CartRepository) CustomerUseCase {
	return &customerUseCase{
		CustomerRepo: customerRepo,
		SalesRepo:    salesRepo,
		CartRepo:     cartRepo,
	}
}

func (cu customerUseCase) GetCustomers(c *gin.Context) {
	customers, err := cu.CustomerRepo.GetCustomers()
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Error al obtener los clientes"})
		return
	}

	for i := range customers {
		client := &customers[i]

		carts, _ := cu.CartRepo.GetCartsByClientID(client.IDCliente)
		sales, _ := cu.SalesRepo.GetSalesByClientID(client.IDCliente)

		client.Estado = cu.resolveEstado(carts, sales)
	}

	c.IndentedJSON(http.StatusOK, customers)
}

func (cu customerUseCase) resolveEstado(carts []domain.Carrito, sales []domain.Venta) string {
	if cu.isClientePerdido(sales) {
		return "CLIENTE PERDIDO"
	}
	if len(sales) > 1 {
		return "CLIENTE ACTIVO"
	}
	if len(sales) == 1 {
		return "CLIENTE"
	}
	if len(carts) > 0 {
		return "INTERESADO"
	}
	return "PROSPECTO"
}

func (cu customerUseCase) isClientePerdido(sales []domain.Venta) bool {
	filterSales := utils.Filter(sales, func(s domain.Venta) bool {
		return s.FechaPedido.Year() > 2025
	})
	return len(filterSales) > 0
}
