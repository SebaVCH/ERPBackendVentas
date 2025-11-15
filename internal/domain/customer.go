package domain

type Cliente struct {
	IDCliente int    `gorm:"column:id_cliente;primaryKey;autoIncrement" json:"id_cliente"`
	Nombre    string `gorm:"column:nombre;type:varchar(100);not null" json:"nombre"`
	Apellido  string `gorm:"column:apellido;type:varchar(100);not null" json:"apellido"`
	Direccion string `gorm:"column:direccion;type:varchar(255)" json:"direccion"`
	Telefono  string `gorm:"column:telefono;type:varchar(20)" json:"telefono"`
	Email     string `gorm:"column:email;type:varchar(100)" json:"email"`
	Estado    string `gorm:"column:estado;type:varchar(50);not null" json:"estado"`
}

func (Cliente) TableName() string {
	return "public.cliente"
}
