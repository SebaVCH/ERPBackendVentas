package domain

type DetalleVenta struct {
	IDVenta    int      `gorm:"column:id_venta;primaryKey;autoIncrement:false" json:"id_venta"`
	IDProducto int      `gorm:"column:id_producto;primaryKey;autoIncrement:false" json:"id_producto"`
	Producto   Producto `gorm:"foreignKey:IDProducto;references:IDProducto" json:"producto"`
	Cantidad   int      `gorm:"column:cantidad;not null" json:"cantidad"`
	PrecioUnit float64  `gorm:"column:precio_unitario;type:float;not null" json:"precio_unit"`
	Venta     Venta   `gorm:"foreignKey:IDVenta;references:IDVenta" json:"ventas"`
}

func (DetalleVenta) TableName() string {
	return "ventas.detalle_venta"
}
