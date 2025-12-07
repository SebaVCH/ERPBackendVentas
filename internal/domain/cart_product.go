package domain

type CarritoProducto struct {
	IDCart      int       `gorm:"column:id_cart;primaryKey;autoIncrement:false" json:"id_cart"`
	IDProducto  int       `gorm:"column:id_producto;primaryKey;autoIncrement:false" json:"id_producto"`
	Carrito     *Carrito  `gorm:"foreignKey:IDCart;references:IDCart" json:"carrito,omitempty"`
	Producto    *Producto `gorm:"foreignKey:IDProducto;references:IDProducto" json:"producto,omitempty"`
	Cantidad    int       `gorm:"column:cantidad;not null" json:"cantidad"`
	PrecioVenta float64   `gorm:"column:precio_venta;type:numeric" json:"precio_venta"`
}

func (CarritoProducto) TableName() string {
	return "Ventas.carrito_producto"
}
