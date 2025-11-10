package repository

import (
	"gorm.io/gorm"
	"github.com/SebaVCH/ERPBackendVentas/internal/database"
)

type CartRepository interface {
	CreateCart(userID int) (domain.Carrito, error)
	GetCartItems(userID int) ([]domain.Producto, error)
	AddCartItem(userID int, item domain.Producto) error
	RemoveCartItem(userID int, itemID int) error
	ClearCart(userID int) error
}

type CartRepository struct {
	db *gorm.DB
}

func NewCartRepository() CartRepository {
	return &CartRepository{
		db: database.DB,
	}
}

func(r *CartRepository) CreateCart(userID int)(domain.Carrito, error){
	// falta implementacion
	return nil, nil 
}

func (r *CartRepository) GetCartItems(userID int) ([]domain.Producto, error) {
	// falta implementacion
	return nil, nil
}

func (r *CartRepository) AddCartItem(userID int, item domain.Producto) error {
	// falta implementacion
	return nil
}

func (r *CartRepository) RemoveCartItem(userID int, itemID int) error {
	// falta implementacion
	return nil
}

func (r *CartRepository) ClearCart(userID int) error {
	// falta implementacion
	return nil
}
