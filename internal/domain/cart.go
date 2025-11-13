package domain

import "time"

type Carrito struct {
	IDCart        int       `gorm:"column:id_cart;primaryKey;autoIncrement" json:"id_cart"`
	IDCliente     int       `gorm:"column:id_cliente;not null" json:"id_cliente"`
	Cliente       Cliente   `gorm:"foreignKey:IDCliente;references:IDCliente" json:"cliente"`
	FechaCreacion time.Time `gorm:"column:fecha_creacion;type:timestamp;not null" json:"fecha_creacion"`
	Estado        bool      `gorm:"column:estado;default:false" json:"estado"` // False significa que el usuario aun no finiquita la compra y el true que ya la finalizo
}

func (Carrito) TableName() string {
	return "Ventas.carrito"
}
