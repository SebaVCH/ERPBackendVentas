package domain

type DetallesExtra struct {
	IDDetalleExtra int       `gorm:"column:id_detalle_extra;primaryKey;autoIncrement" json:"id_detalle_extra"`
	IDProducto     int       `gorm:"column:id_producto;not null" json:"id_producto"`
	Producto       *Producto `gorm:"foreignKey:IDProducto;references:IDProducto" json:"producto,omitempty"`
	Categoria      string    `gorm:"column:categoria;type:varchar(100);not null" json:"categoria"`
	ImagenURL      string    `gorm:"column:imagen_url;type:varchar(255);not null" json:"imagen_url"`
}

func (DetallesExtra) TableName() string {
	return "public.detalles_extra"
}
