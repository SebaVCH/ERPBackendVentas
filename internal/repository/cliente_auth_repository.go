package repository

import (
	"github.com/SebaVCH/ERPBackendVentas/internal/domain"
	"github.com/SebaVCH/ERPBackendVentas/internal/infrastructure/database"
)

type ClienteAuthRepository interface {
	GetByEmail(email string) (*domain.Cliente, error)
	CreateCliente(c *domain.Cliente) error
	UpdatePassword(clienteID int, passwordHash string) error
	CreateClientes(clientes []domain.Cliente) error
}

type clienteAuthRepository struct{}

func NewClienteAuthRepository() ClienteAuthRepository {
	return &clienteAuthRepository{}
}

func (r *clienteAuthRepository) GetByEmail(email string) (*domain.Cliente, error) {
	var c domain.Cliente
	if err := database.DB.Where("email = ?", email).First(&c).Error; err != nil {
		return nil, err
	}
	return &c, nil
}

func (r *clienteAuthRepository) CreateCliente(cust *domain.Cliente) error {
	return database.DB.Create(cust).Error
}

func (r *clienteAuthRepository) UpdatePassword(clienteID int, passwordHash string) error {
	return database.DB.Model(&domain.Cliente{}).Where("id_cliente = ?", clienteID).
		Update("password_hash", passwordHash).Error
}

func (r *clienteAuthRepository) CreateClientes(clientes []domain.Cliente) error {
	return database.DB.Create(&clientes).Error
}
