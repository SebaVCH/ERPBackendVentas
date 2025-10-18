package domain

type Producto struct {
	IDProducto     int     `gorm:"column:id_producto;primaryKey;autoIncrement" json:"id_producto"`
	Nombre         string  `gorm:"column:nombre;type:varchar(100);not null" json:"nombre"`
	Descripcion    string  `gorm:"column:descripcion;type:text" json:"descripcion"`
	PrecioUnitario float64 `gorm:"column:precio_unitario;type:numeric(10,2);not null" json:"precio_unitario"`
	Estado         *bool   `gorm:"column:estado;default:true" json:"estado"`
	Cantidad       int     `gorm:"column:cantidad;default:0" json:"cantidad"`
}

func (Producto) TableName() string {
	return "public.producto"
}
