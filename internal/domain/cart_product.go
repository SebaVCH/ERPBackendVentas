package domain

type CarritoProducto struct {
	IDCart     int      `gorm:"column:id_cart;primaryKey;autoIncrement:false" json:"id_cart"`
	IDProducto int      `gorm:"column:id_producto;primaryKey;autoIncrement:false" json:"id_producto"`
	Carrito    Carrito  `gorm:"foreignKey:IDCart;references:IDCart" json:"carrito"`
	Producto   Producto `gorm:"foreignKey:IDProducto;references:IDProducto" json:"producto"`
	Cantidad   int      `gorm:"column:cantidad;not null" json:"cantidad"`
	PrecioUnit float64  `gorm:"column:precio_unitario;type:numeric(10,3)" json:"precio_unitario"`
}

func (CarritoProducto) TableName() string {
	return "Ventas.carrito_producto"
}
