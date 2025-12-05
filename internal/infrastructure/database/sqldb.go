package database

import (
	"fmt"
	"os"

	"github.com/SebaVCH/ERPBackendVentas/internal/domain"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func StartDB() error {

	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=%s TimeZone=%s",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_SSLMODE"),
		os.Getenv("DB_TIMEZONE"),
	)

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
		DisableForeignKeyConstraintWhenMigrating: true,
	})
	if err != nil {
		return err
	}

	if err := DB.AutoMigrate(
		&domain.Cliente{},
		&domain.Empleado{},
		&domain.Producto{},
		&domain.Venta{},
		&domain.DetalleVenta{},
		&domain.Carrito{},
		&domain.CarritoProducto{},
		&domain.Direccion{},
		&domain.CarritoReserva{},
		&domain.DetallesExtra{},
	); err != nil {
		return err
	}

	return nil
}
