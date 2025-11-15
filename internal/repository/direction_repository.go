package repository

import (
	"github.com/SebaVCH/ERPBackendVentas/internal/domain"
	"github.com/SebaVCH/ERPBackendVentas/internal/infrastructure/database"
	"gorm.io/gorm"
)

type DirectionRepository interface {
	GetDirections() ([]domain.Direccion, error)
	CreateDirection(direccion *domain.Direccion) error
}

type directionRepository struct {
	db *gorm.DB
}

func NewDirectionRepository() DirectionRepository {
	return &directionRepository{
		db: database.DB,
	}
}

func (r *directionRepository) GetDirections() ([]domain.Direccion, error) {
	var directions []domain.Direccion
	err := r.db.
		Preload("Cliente").
		Find(&directions).Error
	if err != nil {
		return nil, err
	}
	return directions, nil
}

func (r *directionRepository) CreateDirection(direccion *domain.Direccion) error {

	return r.db.Transaction(func(tx *gorm.DB) error {

		if err := tx.Where("id_cliente = ?", direccion.IDCliente).
			First(&domain.Cliente{}).Error; err != nil {
			return err
		}

		if err := tx.Create(direccion).Error; err != nil {
			return err
		}

		return nil

	})
}
