package repository

import (
	"github.com/SebaVCH/ERPBackendVentas/internal/domain"
	"github.com/SebaVCH/ERPBackendVentas/internal/infrastructure/database"
	"gorm.io/gorm"
)

type SaleRepository interface {
	GetSales() ([]domain.Venta) error
	GetSale(id int) (*domain.Venta) error
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

func (r *saleRepository) DB() *gorm.DB { return r.db }

func (r  *saleRepository) GetSales() ([]domain.Venta, error) {
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

	var cliente domain.Cliente
    if err := tx.First(&cliente, "id_cliente = ?", sale.IDCliente).Error; err != nil {
        tx.Rollback()
        return err
    }

	var empleado domain.Empleado
    if err := tx.First(&empleado, "id_empleado = ?", sale.IDEmpleado).Error; err != nil {
        tx.Rollback()
        return err
    }

	if err := tx.Create(sale).Error; err != nil {
        tx.Rollback()
        return err
    }

	for i := range sale.DetallesVenta {
		d := &sale.DetallesVenta[i]

		var producto domain.Producto
		if err := tx.First(&producto, "id_producto = ?", d.IDProducto).Error; err != nil {
			tx.Rollback()
			return fmt.Errorf("producto %d no existe: %w", d.IDProducto, err)
		}

		if producto.Cantidad < d.Cantidad {
			tx.Rollback()
			return fmt.Errorf("stock insuficiente para producto %d: disponible %d, pedido %d", producto.IDProducto, producto.Cantidad, d.Cantidad)
		}

		d.IDVenta = sale.IDVenta

		if d.PrecioUnit == 0 {
			d.PrecioUnit = producto.PrecioUnitario
		}

		newQty := producto.Cantidad - d.Cantidad
		if err := tx.Model(&domain.Producto{}).
			Where("id_producto = ?", producto.IDProducto).
			Update("cantidad", newQty).Error; err != nil {
			tx.Rollback()
			return fmt.Errorf("error actualizando stock producto %d: %w", producto.IDProducto, err)
		}
	}

	if len(sale.DetallesVenta) > 0 {
        if err := tx.Create(&sale.DetallesVenta).Error; err != nil {
            tx.Rollback()
            return err
        }
    }

    if err := tx.Commit().Error; err != nil {
        tx.Rollback()
        return err
    }
    return nil
}