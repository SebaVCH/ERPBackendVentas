package repository

import (
	"github.com/SebaVCH/ERPBackendVentas/internal/domain"
	"github.com/SebaVCH/ERPBackendVentas/internal/infrastructure/database"
	"gorm.io/gorm"
)

type DirectionRepository interface {
	GetDirections() ([]domain.Direccion, error)
	GetDirectionByID(directionID int) (*domain.Direccion, error)
	CreateDirection(direccion *domain.Direccion) error
	GetDirectionsByClientID(clientID int) (direcciones []domain.Direccion, err error)
	UpdateDirection(directionID int, direction *domain.Direccion) error
	DeleteDirection(directionID int) error
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

func (r *directionRepository) GetDirectionsByClientID(clientID int) (direcciones []domain.Direccion, err error) {
	err = r.db.Where("id_cliente = ?", clientID).Find(&direcciones).Error

	if err != nil {
		return nil, err
	}
	return direcciones, nil
}

func (r *directionRepository) UpdateDirection(directionID int, updated *domain.Direccion) error {

	var dir domain.Direccion

	if err := r.db.First(&dir, directionID).Error; err != nil {
		return err
	}

	if err := r.db.Model(&dir).Updates(updated).Error; err != nil {
		return err
	}

	return nil
}

func (r *directionRepository) DeleteDirection(directionID int) error {
	result := r.db.Delete(&domain.Direccion{}, directionID)
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return result.Error
}



func (r *directionRepository) GetDirectionByID(directionID int) ( direction *domain.Direccion, err error) {
	if err := r.db.First(&direction, directionID).Error; err != nil {
		return nil, err
	}
	return direction, nil
}