package domain

import "time"

type Empleado struct {
	IDEmpleado   int        `gorm:"column:id_empleado;primaryKey;autoIncrement" json:"id_empleado"`
	Nombre       string     `gorm:"column:nombre;type:varchar(100);not null" json:"nombre"`
	Apellido     string     `gorm:"column:apellido;type:varchar(100);not null" json:"apellido"`
	Rol          string     `gorm:"column:rol;type:varchar(50)" json:"rol"`
	Email        string     `gorm:"column:email;type:varchar(100)" json:"email"`
	Telefono     string     `gorm:"column:telefono;type:varchar(20)" json:"telefono"`
	FechaIngreso time.Time  `gorm:"column:fecha_ingreso;type:timestamp;not null" json:"fecha_ingreso"`
	FechaBaja    *time.Time `gorm:"column:fecha_baja;type:timestamp" json:"fecha_baja"`
	MotivoBaja   string     `gorm:"column:motivo_baja;type:varchar(255)" json:"motivo_baja"`
}

func (Empleado) TableName() string {
	return "public.empleado"
}
