package domain

import "time"

type CarritoReserva struct {
	ReservaID    int       `gorm:"column:id_reserva;primaryKey;autoIncrement" json:"reserva_id"`
	CarritoID    int       `gorm:"column:id_carrito;not null" json:"id_carrito"`
	ClienteID    int       `gorm:"column:id_cliente;not null" json:"id_cliente"`
	ProductoID   int       `gorm:"column:id_producto;not null" json:"id_producto"`
	Carrito      *Carrito   `gorm:"foreignKey:CarritoID;references:IDCart" json:"carrito,omitempty"`
	Producto     *Producto  `gorm:"foreignKey:ProductoID;references:IDProducto" json:"producto,omitempty"`
	Cliente      *Cliente   `gorm:"foreignKey:ClienteID;references:IDCliente" json:"cliente,omitempty"`
	Stock         int       `gorm:"column:stock;not null" json:"stock"`
	FechaReserva  time.Time `gorm:"column:fechareserva;type:timestamp;not null" json:"fecha_reserva"`
}

func (CarritoReserva) TableName() string {
	return "public.reservas_venta_inventario"
}
