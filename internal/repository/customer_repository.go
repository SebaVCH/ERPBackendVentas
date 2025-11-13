package repository

import (
	"github.com/SebaVCH/ERPBackendVentas/internal/domain"
	"github.com/SebaVCH/ERPBackendVentas/internal/infrastructure/database"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type CustomerRepository interface {
	GetCustomers() ([]domain.Cliente, error)
	GetCustomerTx(id int) (bool, error)
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
	err := cu.db.Find(&customers).Preload(clause.Associations).Error
	if err != nil {
		return nil, err
	}
	return customers, nil
}

// Funcion para obtener un cliente dentro de una transaccion en el paquete repository
func (cu *customerRepository) GetCustomerTx(id int) (bool, error) {
	var customer domain.Cliente
	err := cu.db.First(&customer, "id_cliente = ?", id).Preload(clause.Associations).Error
	if err != nil {
		return false, err
	}
	return true, nil
}
