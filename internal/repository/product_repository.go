package repository

import (
	"github.com/SebaVCH/ERPBackendVentas/internal/domain"
	"github.com/SebaVCH/ERPBackendVentas/internal/infrastructure/database"
	"gorm.io/gorm"
)

type ProductRepository interface {
	GetProducts() ([]domain.Producto, error)
}

type productRepository struct {
	db *gorm.DB
}

func NewProductRepository() ProductRepository {
	return &productRepository{
		db: database.DB,
	}
}

func (p *productRepository) GetProducts() ( products []domain.Producto, err error) {
	err = p.db.Find(&products).Error
	if err != nil {
		return nil, err
	}
	return products, nil
}
