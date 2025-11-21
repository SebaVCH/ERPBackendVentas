package domain

type CarritoReserva struct {
	ReservaID string `gorm:"column:reserva_id;primaryKey;autoIncrement" json:"reserva_id"`
	VentaID   string `gorm:"column:venta_id;not null" json:"venta_id"`
	ClienteID string `gorm:"column:cliente_id;not null" json:"cliente_id"`
	ProductoID string `gorm:"column:producto_id;not null" json:"producto_id"`
	Venta Venta   `gorm:"foreignKey:VentaID;references:VentaID" json:"venta"`
	Producto Producto `gorm:"foreignKey:ProductoID;references:ProductoID" json:"producto"`
	Cliente Cliente `gorm:"foreignKey:ClienteID;references:ClienteID" json:"cliente"`
	Stock    int   `gorm:"column:stock;not null" json:"stock"`
	FechaReserva string `gorm:"column:fecha_reserva;not null" json:"fecha_reserva"`
}

func (CarritoReserva) TableName() string {
	return "public.reservas_venta_inventario"
}
