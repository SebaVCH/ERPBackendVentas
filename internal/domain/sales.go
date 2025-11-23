package domain

import "time"

type Venta struct {
	IDVenta           int       `gorm:"column:id_venta;primaryKey;autoIncrement" json:"id_venta"`
	IDCliente         int       `gorm:"column:id_cliente;not null" json:"id_cliente"`
	IDCarrito         int       `gorm:"column:id_carrito;not null" json:"id_carrito"`
	IDDireccion       int       `gorm:"column:id_direccion;not null" json:"id_direccion"`
	Carrito           *Carrito   `gorm:"foreignKey:IDCarrito;references:IDCart" json:"carrito,omitempty"`
	Cliente           *Cliente   `gorm:"foreignKey:IDCliente;references:IDCliente" json:"cliente,omitempty"`
	Direccion         *Direccion `gorm:"foreignKey:IDDireccion;references:IDDireccion" json:"direccion,omitempty"`
	FechaPedido       time.Time `gorm:"column:fecha_pedido;type:timestamp;not null" json:"fecha_pedido"`
	Total             float64   `gorm:"column:total;type:float;not null" json:"total"`
	Estado            string    `gorm:"column:estado;type:varchar(50);not null" json:"estado"`
	FormaDePago       string    `gorm:"column:forma_de_pago;type:varchar(50);not null" json:"forma_de_pago"`
	CondicionesDePago string    `gorm:"column:condiciones_de_pago;type:varchar(100);not null" json:"condiciones_de_pago"`
}

func (Venta) TableName() string {
	return "Ventas.ventas"
}
