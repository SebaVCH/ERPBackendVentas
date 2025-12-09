package repository

import (
	"github.com/SebaVCH/ERPBackendVentas/internal/domain"
	"github.com/SebaVCH/ERPBackendVentas/internal/infrastructure/database"
	"gorm.io/gorm"
)

type EmployeeRepository interface {
	GetByEmail(email string) (*domain.Empleado, error)
	GetByRut(rut string) (*domain.Empleado, error)
	GetUserByEmployeeID(employeeID int) (*domain.UsuarioRRHH, error)
	CreateEmployee(emp *domain.Empleado) error
	CreateUser(user *domain.UsuarioRRHH) error
}

type employeeRepository struct {
	db *gorm.DB
}

func NewEmployeeRepository() EmployeeRepository {
	return &employeeRepository{
		db: database.DB,
	}
}

func (r *employeeRepository) GetByEmail(email string) (*domain.Empleado, error) {
	var emp domain.Empleado
	if err := r.db.Where("email = ?", email).First(&emp).Error; err != nil {
		return nil, err
	}
	return &emp, nil
}

func (r *employeeRepository) GetByRut(rut string) (*domain.Empleado, error) {
	var emp domain.Empleado
	if err := r.db.Where("rut = ?", rut).First(&emp).Error; err != nil {
		return nil, err
	}
	return &emp, nil
}

func (r *employeeRepository) GetUserByEmployeeID(employeeID int) (*domain.UsuarioRRHH, error) {
	var user domain.UsuarioRRHH
	if err := r.db.Where("id_empleado = ? AND activo = ?", employeeID, true).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *employeeRepository) CreateEmployee(emp *domain.Empleado) error {
	return r.db.Create(emp).Error
}

func (r *employeeRepository) CreateUser(user *domain.UsuarioRRHH) error {
	return r.db.Create(user).Error
}
