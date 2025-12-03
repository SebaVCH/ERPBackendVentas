package domain

import "time"


type EstadoCliente string

const (
    EstadoProspecto      EstadoCliente = "PROSPECTO"
    EstadoInteresado     EstadoCliente = "INTERESADO"
    EstadoClienteNuevo   EstadoCliente = "CLIENTE_NUEVO"
    EstadoClienteActivo  EstadoCliente = "CLIENTE_ACTIVO"
    EstadoClientePerdido EstadoCliente = "CLIENTE_PERDIDO"
)


type Cliente struct {
	IDCliente int    `gorm:"column:id_cliente;primaryKey;autoIncrement" json:"id_cliente"`
	Nombre    string `gorm:"column:nombre;type:varchar(100);not null" json:"nombre"`
	PasswordHash string       `gorm:"column:password_hash;type:varchar(255)" json:"-"`
	CreatedAt    time.Time    `gorm:"column:created_at;autoCreateTime" json:"created_at"`
	Apellido  string `gorm:"column:apellido;type:varchar(100);not null" json:"apellido"`
	Direccion string `gorm:"column:direccion;type:varchar(255)" json:"direccion"`
	Telefono  string `gorm:"column:telefono;type:varchar(20)" json:"telefono"`
	Email     string `gorm:"column:email;type:varchar(100)" json:"email"`
	Estado    EstadoCliente `gorm:"column:estado;type:varchar(50);not null" json:"estado"`
}

func (Cliente) TableName() string {
	return "public.cliente"
}
