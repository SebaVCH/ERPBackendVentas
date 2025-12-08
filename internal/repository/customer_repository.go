package repository

import (
	"github.com/SebaVCH/ERPBackendVentas/internal/domain"
	"github.com/SebaVCH/ERPBackendVentas/internal/infrastructure/database"
	"gorm.io/gorm"
)

type CustomerRepository interface {
	GetCustomers() ([]domain.Cliente, error)
	GetCustomerTx(id int) (bool, error)
	GetCustomerByID(id int) (domain.Cliente, error)
	UpdateCustomer(customer domain.Cliente) error
}

type customerRepository struct {
	db *gorm.DB
}

func NewCustomerRepository() CustomerRepository {
	return &customerRepository{
		db: database.DB,
	}
}

func (cu customerRepository) GetCustomers() ([]domain.Cliente, error) {
	var customers []domain.Cliente
	err := cu.db.Find(&customers).Error
	if err != nil {
		return nil, err
	}
	return customers, nil
}

// Funcion para obtener un cliente dentro de una transaccion en el paquete repository
func (cu *customerRepository) GetCustomerTx(id int) (bool, error) {
	var customer domain.Cliente
	err := cu.db.First(&customer, "id_cliente = ?", id).Error
	if err != nil {
		return false, err
	}
	return true, nil
}

// GetCustomerByID implements CustomerRepository.
func (cu *customerRepository) GetCustomerByID(id int) (domain.Cliente, error) {
	var customer domain.Cliente
	err := cu.db.First(&customer, "id_cliente = ?", id).Error
	if err != nil {
		return domain.Cliente{}, err
	}
	return customer, nil
}

func (cu *customerRepository) UpdateCustomer(customer domain.Cliente) error {
	err := cu.db.Model(&customer).Updates(customer).Error
	if err != nil {
		return err
	}
	return nil
}
