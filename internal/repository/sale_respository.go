package repository

import (
	"github.com/SebaVCH/ERPBackendVentas/internal/domain"
	"github.com/SebaVCH/ERPBackendVentas/internal/infrastructure/database"
	"gorm.io/gorm"
)

type SaleRepository interface {
	GetSales() ([]domain.Venta, error)
	GetSale(id int) (*domain.Venta, error)
	CreateSale(sale *domain.Venta) (*domain.Venta, error)
	GetProductQuantity(pID int) int
}

type saleRepository struct {
	db *gorm.DB
}

func NewSaleRepository() SaleRepository {
	return &saleRepository{
		db: database.DB,
	}
}

func (r *saleRepository) GetSales() ([]domain.Venta, error) {
	var ventas []domain.Venta
	err := r.db.
		Preload("Cliente").
		Preload("DetallesVenta").
		//Preload("DetallesVenta.Producto").
		Find(&ventas).Error
	if err != nil {
		return nil, err
	}
	return ventas, nil
}

func (r *saleRepository) GetSale(id int) (*domain.Venta, error) {
	var venta domain.Venta
	err := r.db.
		Preload("Cliente").
		Preload("DetallesVenta").
		//Preload("DetallesVenta.Producto").
		First(&venta, "id_venta = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &venta, nil
}

func (r *saleRepository) CreateSale(sale *domain.Venta) (*domain.Venta, error) {
	tx := r.db.Begin()

	if tx.Error != nil {
		return nil, tx.Error
	}

	if err := tx.Omit("DetallesVenta.Venta").Create(sale).Error; err != nil {
		tx.Rollback()
		return nil, err
	}
	
	for _, d := range sale.DetallesVenta {
		if err := tx.Model(&domain.Producto{}).
			Where("id_producto = ?", d.IDProducto).
			UpdateColumn("cantidad", gorm.Expr("cantidad - ?", d.Cantidad)).Error; err != nil {
			tx.Rollback()
			return nil, err
		}
	}

	if err := tx.Commit().Error; err != nil {
		tx.Rollback()
		return nil, err
	}

	created, err := r.GetSale(sale.IDVenta)
	if err != nil {
		return nil, err
	}

	return created, nil
}

func (r *saleRepository) GetProductQuantity(pID int) int {
	var producto domain.Producto
	err := r.db.First(&producto, "id_producto = ?", pID).Error
	if err != nil {
		return 0
	}
	return producto.Cantidad
}
