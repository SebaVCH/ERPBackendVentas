package domain

type DetalleVenta struct {
	IDVenta     int       `gorm:"column:id_venta;primaryKey;autoIncrement:false" json:"id_venta"`
	IDProducto  int       `gorm:"column:id_producto;primaryKey;autoIncrement:false" json:"id_producto"`
	Venta       *Venta    `gorm:"foreignKey:IDVenta;references:IDVenta" json:"venta,omitempty"`
	Producto    *Producto `gorm:"foreignKey:IDProducto;references:IDProducto" json:"producto,omitempty"`
	Cantidad    int       `gorm:"column:cantidad;not null" json:"cantidad"`
	PrecioVenta float64   `gorm:"column:precio_venta;type:numeric;not null" json:"precio_venta"`
}

func (DetalleVenta) TableName() string {
	return "Ventas.detalle_venta"
}
