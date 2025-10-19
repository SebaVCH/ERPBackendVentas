package repository

import (
	"github.com/SebaVCH/ERPBackendVentas/internal/domain"
	"github.com/SebaVCH/ERPBackendVentas/internal/infrastructure/database"
	"gorm.io/gorm"
)

type CustomerRepository interface {
	GetCustomers() ([]domain.Cliente, error)
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
