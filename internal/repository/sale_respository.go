package repository

import (
	"errors"
	"fmt"

	"github.com/SebaVCH/ERPBackendVentas/internal/domain"
	"github.com/SebaVCH/ERPBackendVentas/internal/infrastructure/database"
	"gorm.io/gorm"
)

type SaleRepository interface {
	GetSales() ([]domain.Venta, error)
	GetSale(id int) (*domain.Venta, error)
	CreateSale(venta *domain.Venta, detalles []domain.DetalleVenta) error
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

func (r *saleRepository) CreateSale(venta *domain.Venta, detalles []domain.DetalleVenta) error {
	return r.db.Transaction(func(tx *gorm.DB) error {

		// Aca se formaliza la venta
		if err := tx.Create(venta).Error; err != nil {
			return err
		}

		// Antes de pasar a formalizar los detalle de venta, se debe corroborar que el id se obtiene correctamente
		if venta.IDVenta == 0 {
			return errors.New("no se pudo obtener el ID de la venta creada")
		}

		// Ahora se crean los detalles de la venta
		for i := range detalles {

			detalles[i].IDVenta = venta.IDVenta

			var product domain.Producto

			// Se obtiene el producto de dicha id
			if err := tx.Where("id_producto = ?", detalles[i].IDProducto).First(&product).Error; err != nil {
				return err
			}

			// Aca verifico que haya stock suficiente
			if product.Cantidad < detalles[i].Cantidad {
				return errors.New("no hay suficiente stock para realizar la venta")
			}

			// Se crea el detalle de la venta
			if err := tx.Create(&detalles[i]).Error; err != nil {
				return err
			}

			// aca realizo la el descuento del producto
			result := tx.Model(&domain.Producto{}).
				Where("id_producto = ? AND cantidad >= ?", detalles[i].IDProducto, detalles[i].Cantidad).
				UpdateColumn("cantidad", gorm.Expr("cantidad - ?", detalles[i].Cantidad))
			if result.Error != nil {
				return result.Error
			}
			if result.RowsAffected == 0 {
				return errors.New("stock insuficiente para producto id " + fmt.Sprint(detalles[i].IDProducto))
			}
		}

		// Como ya se realizo la venta correctamente, el carrito queda como inactivo
		if err := tx.Model(&domain.Carrito{}).
			Where("id_cart = ?", venta.IDCarrito).
			Update("estado", true).Error; err != nil {
			return err
		}

		cartRepo := &cartRepository{db: tx}
		if _, err := cartRepo.CreateCartTx(tx, venta.IDCliente); err != nil {
			return err
		}
		return nil
	})
}

func (r *saleRepository) GetSales() ([]domain.Venta, error) {
	var ventas []domain.Venta
	err := r.db.
		Preload("Cliente").
		Preload("Carrito").
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
		Preload("Carrito").
		First(&venta, "id_venta = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &venta, nil
}

func (r *saleRepository) GetProductQuantity(pID int) int {
	var producto domain.Producto
	err := r.db.First(&producto, "id_producto = ?", pID).Error
	if err != nil {
		return 0
	}
	return producto.Cantidad
}
