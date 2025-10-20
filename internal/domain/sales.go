package domain

import "time"

type Venta struct {
	IDVenta           int            `gorm:"column:id_venta;primaryKey;autoIncrement" json:"id_venta"`
	IDCliente         int            `gorm:"column:id_cliente;not null" json:"id_cliente"`
	IDEmpleado        int            `gorm:"column:id_empleado;not null" json:"id_empleado"`
	Empleado          Empleado       `gorm:"foreignKey:IDEmpleado;references:IDEmpleado" json:"empleado"`
	DetallesVenta     []DetalleVenta `gorm:"foreignKey:IDVenta;references:IDVenta" json:"detalles_venta"`
	Cliente           Cliente        `gorm:"foreignKey:IDCliente;references:IDCliente" json:"cliente"`
	FechaPedido       time.Time      `gorm:"column:fecha_pedido;type:timestamp;not null" json:"fecha_pedido"`
	Total             float64        `gorm:"column:total;type:float;not null" json:"total"`
	Estado            *bool          `gorm:"column:estado;default:true" json:"estado"`
	FormaDePago       string         `gorm:"column:forma_de_pago;type:varchar(50);not null" json:"forma_de_pago"`
	CondicionesDePago string         `gorm:"column:condiciones_de_pago;type:varchar(100);not null" json:"condiciones_de_pago"`
}

func (Venta) TableName() string {
	return "ventas.ventas"
}
