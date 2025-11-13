package repository

import (
	"errors"
	"time"

	"github.com/SebaVCH/ERPBackendVentas/internal/domain"
	"github.com/SebaVCH/ERPBackendVentas/internal/infrastructure/database"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type CartRepository interface {
	CreateCart(userID int) (domain.Carrito, error)
	CreateCartTx(tx *gorm.DB, userID int) (domain.Carrito, error)
	GetCartItems(userID int) (*domain.Carrito, []domain.CarritoProducto, error)
	AddCartItem(clientID int, cartProduct domain.CarritoProducto) error
	RemoveCartItem(clientID int, cartProduct domain.CarritoProducto) error
	ClearCart(userID int) error
	AuxiliarItemVerificationTx(tx *gorm.DB, clientID int, cartProduct domain.CarritoProducto) error
}

type cartRepository struct {
	db *gorm.DB
}

func NewCartRepository() CartRepository {
	return &cartRepository{
		db: database.DB,
	}
}

// Implementado
func (r *cartRepository) CreateCart(userID int) (domain.Carrito, error) {

	// Verificar que el usuario exista
	var cliente domain.Cliente
	if err := r.db.First(&cliente, "id_cliente = ?", userID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return domain.Carrito{}, errors.New("cliente no encontrado")
		}
		return domain.Carrito{}, err
	}

	var newCart domain.Carrito
	if err := r.db.Transaction(func(tx *gorm.DB) error {
		var existing domain.Carrito

		// Verificar que el usuario no posee un carrito activo
		if err := tx.Where("id_cliente = ? AND estado = ?", userID, false).First(&existing).Error; err == nil {
			return errors.New("el cliente ya tiene un carrito activo")
		} else if !errors.Is(err, gorm.ErrRecordNotFound) {
			return err
		}

		newCart = domain.Carrito{
			IDCliente:     userID,
			FechaCreacion: time.Now(),
			Estado:        false,
		}

		// Creamos el carrito
		if err := tx.Select("IDCliente", "FechaCreacion", "Estado").Create(&newCart).Error; err != nil {
			return err
		}

		newCart.Cliente = cliente

		return nil
	}); err != nil {
		return domain.Carrito{}, err
	}
	return newCart, nil
}

// Esta funcion es para uso interno estre el paquete repository
func (r *cartRepository) CreateCartTx(tx *gorm.DB, userID int) (domain.Carrito, error) {

	var cliente domain.Cliente
	if err := tx.First(&cliente, "id_cliente = ?", userID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return domain.Carrito{}, errors.New("cliente no encontrado")
		}
		return domain.Carrito{}, err
	}

	newCart := domain.Carrito{
		IDCliente:     userID,
		FechaCreacion: time.Now(),
		Estado:        false,
	}

	if err := tx.
		Select("IDCliente", "FechaCreacion", "Estado").
		Create(&newCart).Error; err != nil {
		return domain.Carrito{}, err
	}

	newCart.Cliente = cliente
	return newCart, nil
}

// Implementado

func (r *cartRepository) GetCartItems(userID int) (*domain.Carrito, []domain.CarritoProducto, error) {

	var cart domain.Carrito
	if err := r.db.
		Preload("Cliente").
		Where("id_cliente = ? AND estado = ?", userID, false).
		First(&cart).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil, errors.New("carrito no encontrado para el cliente")
		}
		return nil, nil, err
	}

	var cartProducts []domain.CarritoProducto
	if err := r.db.
		Preload("Producto").
		Preload("Carrito").
		Preload("Carrito.Cliente").
		Where("id_cart = ?", cart.IDCart).
		Find(&cartProducts).Error; err != nil {
		return &cart, nil, err
	}

	return &cart, cartProducts, nil
}

// Implementado deuda tecnica (NO HAY RESERVA DE STOCK AL SUMAR ITEMS)
func (r *cartRepository) AddCartItem(clientID int, cartProduct domain.CarritoProducto) error {

	return r.db.Transaction(func(tx *gorm.DB) error {

		// Verificacion auxiliar de los items del carrito
		if err := r.AuxiliarItemVerificationTx(tx, clientID, cartProduct); err != nil {
			return err
		}

		var existing domain.CarritoProducto
		err := tx.Where("id_cart = ? AND id_producto = ?", cartProduct.IDCart, cartProduct.IDProducto).First(&existing).Error
		if err == nil {

			// Verificar stock disponible
			var product domain.Producto
			if err := tx.Where("id_producto = ?", cartProduct.IDProducto).First(&product).Error; err != nil {
				if errors.Is(err, gorm.ErrRecordNotFound) {
					return errors.New("producto no encontrado")
				}
				return err
			}

			goal := existing.Cantidad + cartProduct.Cantidad
			if product.Cantidad < goal {
				return errors.New("stock insuficiente para agregar la cantidad solicitada")
			}

			result := tx.Model(&domain.CarritoProducto{}).
				Where("id_cart = ? AND id_producto = ?", cartProduct.IDCart, cartProduct.IDProducto).
				UpdateColumns(map[string]interface{}{
					"cantidad":        gorm.Expr("cantidad + ?", cartProduct.Cantidad),
					"precio_unitario": cartProduct.PrecioUnit,
				})

			if result.Error != nil {
				return result.Error
			}
			if result.RowsAffected == 0 {
				return errors.New("no se pudo actualizar el item del carrito")
			}
			return nil
		} else if errors.Is(err, gorm.ErrRecordNotFound) {

			var product domain.Producto

			// Aca no permite seguir agregando si el stock es insuficiente
			if err := tx.Clauses(clause.Locking{Strength: "UPDATE"}).
				Where("id_producto = ?", cartProduct.IDProducto).
				First(&product).Error; err != nil {
				if errors.Is(err, gorm.ErrRecordNotFound) {
					return errors.New("producto no encontrado")
				}
				return err
			}

			if product.Cantidad < cartProduct.Cantidad {
				return errors.New("stock insuficiente para agregar al carrito")
			}

			if err := tx.Create(&cartProduct).Error; err != nil {
				return err
			}
			return nil
		} else {
			return err
		}
	})
}

// Implementado
func (r *cartRepository) RemoveCartItem(userID int, cartProduct domain.CarritoProducto) error {

	return r.db.Transaction(func(tx *gorm.DB) error {

		// Verificacion auxiliar de los items del carrito
		if err := r.AuxiliarItemVerificationTx(tx, userID, cartProduct); err != nil {
			return err
		}

		var existing domain.CarritoProducto
		if err := tx.Clauses(clause.Locking{Strength: "UPDATE"}).
			Where("id_cart = ? AND id_producto = ?", cartProduct.IDCart, cartProduct.IDProducto).
			First(&existing).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return errors.New("item no encontrado en el carrito")
			}
			return err
		}
		if cartProduct.Cantidad > existing.Cantidad {
			return errors.New("la cantidad a eliminar supera la cantidad en el carrito")
		}

		// me elimina el iten si la cant es 0
		if cartProduct.Cantidad == existing.Cantidad {
			if err := tx.Delete(&domain.CarritoProducto{}, "id_cart = ? AND id_producto = ?", cartProduct.IDCart, cartProduct.IDProducto).Error; err != nil {
				return err
			}
			return nil
		}

		// finalmente se resta la cantidad solicitada
		result := tx.Model(&domain.CarritoProducto{}).
			Where("id_cart = ? AND id_producto = ?", cartProduct.IDCart, cartProduct.IDProducto).
			UpdateColumns(map[string]interface{}{
				"cantidad": gorm.Expr("cantidad - ?", cartProduct.Cantidad),
			})

		if result.Error != nil {
			return result.Error
		}
		if result.RowsAffected == 0 {
			return errors.New("no se pudo actualizar el item del carrito")
		}
		return nil
	})
}

func (r *cartRepository) ClearCart(userID int) error {
	// falta Implementacion
	return nil
}

func (r *cartRepository) AuxiliarItemVerificationTx(tx *gorm.DB, clientID int, cartProduct domain.CarritoProducto) error {
	// Verificar que el cliente exista
	var cliente domain.Cliente
	if err := tx.First(&cliente, "id_cliente = ?", clientID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("cliente no encontrado")
		}
		return err
	}

	// Verificar que el carrito exista y tenga el mismo cliente
	var carrito domain.Carrito
	if err := tx.First(&carrito, "id_cart = ?", cartProduct.IDCart).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("carrito no encontrado")
		}
		return err
	}
	if carrito.IDCliente != clientID {
		return errors.New("el cliente no es el dueño del carrito")
	}

	if carrito.Estado {
		return errors.New("no se puede modificar un carrito ya pagado")
	}

	return nil
}
