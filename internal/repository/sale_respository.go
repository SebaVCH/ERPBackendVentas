package repository

import (
	"github.com/SebaVCH/ERPBackendVentas/internal/domain"
	"github.com/SebaVCH/ERPBackendVentas/internal/infrastructure/database"
	"gorm.io/gorm"
)

type SaleRepository interface {
	GetSales() ([]domain.Venta, error)
	GetSale(id int) (*domain.Venta, error)
	CreateSale(sale *domain.Venta) error
	DB() *gorm.DB
}

type saleRepository struct {
	db *gorm.DB
}

func NewSaleRepository() SaleRepository {
	return &saleRepository{
		db: database.DB,
	}
}

func (r *saleRepository) DB() *gorm.DB {
	return r.db
}

func (r *saleRepository) GetSales() ([]domain.Venta, error) {
	var ventas []domain.Venta
	err := r.db.
		Preload("Empleado").
		Preload("Cliente").
		Preload("DetallesVenta").
		Find(&ventas).Error
	if err != nil {
		return nil, err
	}
	return ventas, nil
}

func (r *saleRepository) GetSale(id int) (*domain.Venta, error) {
	var venta domain.Venta
	err := r.db.
		Preload("Empleado").
		Preload("Cliente").
		Preload("DetallesVenta").
		First(&venta, "id_venta = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &venta, nil
}

func (r *saleRepository) CreateSale(sale *domain.Venta) error {
	tx := r.db.Begin()

	if tx.Error != nil {
		return tx.Error
	}

	if err := tx.Omit("DetallesVenta.Venta").Create(sale).Error; err != nil {
		tx.Rollback()
		return err
	}

	if err := tx.Commit().Error; err != nil {
		tx.Rollback()
		return err
	}

	return nil
}
