package repository

import (
	"errors"
	"fmt"
	"time"

	"github.com/SebaVCH/ERPBackendVentas/internal/domain"
	"github.com/SebaVCH/ERPBackendVentas/internal/infrastructure/database"
	"gorm.io/gorm"
)

type SaleRepository interface {
	GetSales() ([]domain.Venta, error)
	GetSale(id int) (*domain.Venta, error)
	CreateSale(venta *domain.Venta, detalles []domain.DetalleVenta) error
	GetProductQuantity(pID int) int
	GetSalesByClientID(clientID int) (sales []domain.Venta, err error)
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

		// se verifica que el cliente exista
		var client domain.Cliente
		if err := tx.Where("id_cliente = ?", venta.IDCliente).
			First(&client).Error; err != nil {
			return err
		}

		var direccion domain.Direccion
		// se verifica que la direccion exista y sea de ese cliente
		if err := tx.Where("id_direccion = ? AND id_cliente = ?", venta.IDDireccion, venta.IDCliente).
			First(&direccion).Error; err != nil {
			return err
		}

		// Antes de pasar a formalizar los detalle de venta, se debe corroborar que el id se obtiene correctamente
		if venta.IDVenta == 0 {
			return errors.New("no se pudo obtener el ID de la venta creada")
		}

		// Validar reservas: cargar reservas del carrito para los productos de la venta
		var productIDs []int
		for i := range detalles {
			productIDs = append(productIDs, detalles[i].IDProducto)
		}

		var reservas []domain.CarritoReserva
		if err := tx.Where("id_carrito = ? AND id_producto IN ?", venta.IDCarrito, productIDs).Find(&reservas).Error; err != nil {
			return err
		}

		reservasMap := make(map[int]domain.CarritoReserva, len(reservas))
		for _, r := range reservas {
			reservasMap[r.ProductoID] = r
		}

		// Ahora se crean los detalles de la venta
		for i := range detalles {
			
			// Validar que exista una reserva válida y no expirada para este producto
			res, ok := reservasMap[detalles[i].IDProducto]
			if !ok {
				return errors.New("no hay reserva para el producto id " + fmt.Sprint(detalles[i].IDProducto))
			}
			if time.Now().After(res.FechaReserva) {
				return errors.New("la reserva para el producto id " + fmt.Sprint(detalles[i].IDProducto) + " ha expirado")
			}

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

			// aca elimina reserva asociada al carrito y producto 
			if err := tx.Delete(&domain.CarritoReserva{}, "id_carrito = ? AND id_producto = ?", venta.IDCarrito, detalles[i].IDProducto).Error; err != nil {
				return err
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
		Find(&ventas).Error
	if err != nil {
		return nil, err
	}
	return ventas, nil
}

func (r *saleRepository) GetSale(id int) (*domain.Venta, error) {
	var venta domain.Venta
	err := r.db.
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


func (r *saleRepository) GetSalesByClientID(clientID int) (sales []domain.Venta, err error) {
	if err := r.db.
		Where("id_cliente = ?", clientID).
		Find(&sales).Error; err != nil {
			return nil, err	
	}
	return sales, nil
}
