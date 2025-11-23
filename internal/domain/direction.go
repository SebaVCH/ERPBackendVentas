package domain

type Direccion struct {
	IDDireccion  int     `gorm:"column:id_direccion;primaryKey;autoIncrement" json:"id_direccion"`
	IDCliente    int     `gorm:"column:id_cliente;not null" json:"id_cliente"`
	Cliente      *Cliente `gorm:"foreignKey:IDCliente;references:IDCliente" json:"cliente,omitempty"`
	Direccion    string  `gorm:"column:direccion;type:varchar(255);not null" json:"direccion"`
	Numero       string  `gorm:"column:numero;type:varchar(20);not null" json:"numero"`
	Ciudad       string  `gorm:"column:ciudad;type:varchar(100);not null" json:"ciudad"`
	Region       string  `gorm:"column:region;type:varchar(100);not null" json:"region"`
	Comuna       string  `gorm:"column:comuna;type:varchar(100);not null" json:"comuna"`
	CodigoPostal string  `gorm:"column:codigo_postal;type:varchar(20);not null" json:"codigo_postal"`
	Etiqueta     *string `gorm:"column:etiqueta;type:varchar(50)" json:"etiqueta,omitempty"`
}

func (Direccion) TableName() string {
	return "public.direccion"
}
