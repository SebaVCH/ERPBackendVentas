package domain

type UsuarioRRHH struct {
	IDUsuario  int    `gorm:"column:id_usuario;primaryKey;autoIncrement" json:"id_usuario"`
	IDEmpleado int    `gorm:"column:id_empleado;not null" json:"id_empleado"`
	Password   string `gorm:"column:password_hash;type:varchar(255);not null" json:"-"`
	Activo     bool   `gorm:"column:activo;not null" json:"activo"`
}

func (UsuarioRRHH) TableName() string {
	return "RRHH.rrhh_usuario"
}
