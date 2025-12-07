package domain

type Producto struct {
	IDProducto  int     `gorm:"column:id_producto;primaryKey;autoIncrement" json:"id_producto"`
	Nombre      string  `gorm:"column:nombre;type:varchar(100);not null" json:"nombre"`
	Descripcion string  `gorm:"column:descripcion;type:text" json:"descripcion"`
	PrecioVenta float64 `gorm:"column:precio_venta;type:numeric;not null" json:"precio_venta"`
	Estado      *bool   `gorm:"column:estado;default:true" json:"estado"`
	Cantidad    int     `gorm:"column:cantidad;default:0" json:"cantidad"`
}

func (Producto) TableName() string {
	return "public.producto"
}
