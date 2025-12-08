package domain

type ProductoPorDespachar struct {
	IDRegistro           int    `gorm:"column:id_registro;primaryKey;autoIncrement" json:"id_registro"`
	IDProducto           int    `gorm:"column:id_producto;not null" json:"id_producto"`
	CantidadPorDespachar int    `gorm:"column:cantidad_por_despachar;not null" json:"cantidad_por_despachar"`
	FechaRegistro        string `gorm:"column:fecha_registro;" json:"fecha_registro"`
}

func (ProductoPorDespachar) TableName() string {
	return "public.productos_por_despachar"
}
