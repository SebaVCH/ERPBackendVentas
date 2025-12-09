package usecase

import (
	"net/http"
	"time"

	"github.com/SebaVCH/ERPBackendVentas/internal/domain"
	"github.com/SebaVCH/ERPBackendVentas/internal/infrastructure/auth"
	"github.com/SebaVCH/ERPBackendVentas/internal/repository"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

type EmployeeUsecase interface {
	LoginEmployee(ctx *gin.Context) error
	RegisterEmployee(ctx *gin.Context) error
}

type employeeUsecase struct {
	employeeRepo repository.EmployeeRepository
}

func NewEmployeeUsecase(employeeRepo repository.EmployeeRepository) EmployeeUsecase {
	return &employeeUsecase{
		employeeRepo: employeeRepo,
	}
}

type EmployeeLoginRequest struct {
	Identifier string `json:"identifier" binding:"required"`
	Password   string `json:"password" binding:"required"`
}

type EmployeeRegisterRequest struct {
	IDDepartamento int    `json:"id_departamento" binding:"required"`
	Nombre         string `json:"nombre" binding:"required"`
	Apellido       string `json:"apellido" binding:"required"`
	Rol            string `json:"rol"`
	Email          string `json:"email" binding:"required,email"`
	Telefono       string `json:"telefono"`
	Rut            string `json:"rut" binding:"required"`
	Password       string `json:"password" binding:"required,min=6"`
}

func (u *employeeUsecase) LoginEmployee(ctx *gin.Context) error {
	var req EmployeeLoginRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		respondJSON(ctx, http.StatusBadRequest, APIResponse{
			Success: false,
			Message: "request inválido",
			Error:   err.Error(),
		})
		return nil
	}

	// Intentar buscar por email primero, luego por RUT
	var employee *domain.Empleado
	var err error

	employee, err = u.employeeRepo.GetByEmail(req.Identifier)
	if err != nil {
		employee, err = u.employeeRepo.GetByRut(req.Identifier)
		if err != nil {
			respondJSON(ctx, http.StatusUnauthorized, APIResponse{
				Success: false,
				Message: "credenciales inválidas",
				Error:   "empleado no encontrado",
			})
			return nil
		}
	}

	// Verificar que el empleado esté activo
	if employee.Estado != "activo" {
		respondJSON(ctx, http.StatusForbidden, APIResponse{
			Success: false,
			Message: "acceso denegado",
			Error:   "empleado inactivo",
		})
		return nil
	}

	// Obtener usuario de RRHH
	user, err := u.employeeRepo.GetUserByEmployeeID(employee.IDEmpleado)
	if err != nil {
		respondJSON(ctx, http.StatusUnauthorized, APIResponse{
			Success: false,
			Message: "credenciales inválidas",
			Error:   "usuario no encontrado o inactivo",
		})
		return nil
	}

	// Verificar contraseña
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		respondJSON(ctx, http.StatusUnauthorized, APIResponse{
			Success: false,
			Message: "credenciales inválidas",
			Error:   "contraseña incorrecta",
		})
		return nil
	}

	// Generar token
	token, err := auth.GenerateToken(employee.IDEmpleado, employee.Email, "employee", 1440)
	if err != nil {
		respondJSON(ctx, http.StatusInternalServerError, APIResponse{
			Success: false,
			Message: "error al generar token",
			Error:   err.Error(),
		})
		return err
	}

	respondJSON(ctx, http.StatusOK, APIResponse{
		Success: true,
		Message: "login exitoso",
		Data: gin.H{
			"token": token,
			"empleado": gin.H{
				"id_empleado":     employee.IDEmpleado,
				"nombre":          employee.Nombre,
				"apellido":        employee.Apellido,
				"email":           employee.Email,
				"rol":             employee.Rol,
				"id_departamento": employee.IDDepartamento,
				"rut":             employee.Rut,
			},
			"expires_at": time.Now().Add(24 * time.Hour),
		},
	})
	return nil
}

func (u *employeeUsecase) RegisterEmployee(ctx *gin.Context) error {
	var req EmployeeRegisterRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		respondJSON(ctx, http.StatusBadRequest, APIResponse{
			Success: false,
			Message: "request inválido",
			Error:   err.Error(),
		})
		return nil
	}

	// Verificar si el empleado ya existe por email o RUT
	if _, err := u.employeeRepo.GetByEmail(req.Email); err == nil {
		respondJSON(ctx, http.StatusConflict, APIResponse{
			Success: false,
			Message: "el empleado ya existe",
			Error:   "email ya registrado",
		})
		return nil
	}

	if _, err := u.employeeRepo.GetByRut(req.Rut); err == nil {
		respondJSON(ctx, http.StatusConflict, APIResponse{
			Success: false,
			Message: "el empleado ya existe",
			Error:   "RUT ya registrado",
		})
		return nil
	}

	// Hashear contraseña
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		respondJSON(ctx, http.StatusInternalServerError, APIResponse{
			Success: false,
			Message: "error al procesar contraseña",
			Error:   err.Error(),
		})
		return err
	}

	// Crear empleado
	employee := &domain.Empleado{
		IDDepartamento: req.IDDepartamento,
		Nombre:         req.Nombre,
		Apellido:       req.Apellido,
		Rol:            req.Rol,
		Email:          req.Email,
		Estado:         "activo",
		Telefono:       req.Telefono,
		Rut:            req.Rut,
		FechaIngreso:   time.Now(),
	}

	if err := u.employeeRepo.CreateEmployee(employee); err != nil {
		respondJSON(ctx, http.StatusInternalServerError, APIResponse{
			Success: false,
			Message: "error al crear empleado",
			Error:   err.Error(),
		})
		return err
	}

	// Crear usuario RRHH
	user := &domain.UsuarioRRHH{
		IDEmpleado: employee.IDEmpleado,
		Password:   string(hashedPassword),
		Activo:     true,
	}

	if err := u.employeeRepo.CreateUser(user); err != nil {
		respondJSON(ctx, http.StatusInternalServerError, APIResponse{
			Success: false,
			Message: "error al crear usuario",
			Error:   err.Error(),
		})
		return err
	}

	respondJSON(ctx, http.StatusCreated, APIResponse{
		Success: true,
		Message: "empleado registrado exitosamente",
		Data: gin.H{
			"id_empleado":     employee.IDEmpleado,
			"nombre":          employee.Nombre,
			"apellido":        employee.Apellido,
			"email":           employee.Email,
			"rol":             employee.Rol,
			"id_departamento": employee.IDDepartamento,
			"rut":             employee.Rut,
		},
	})
	return nil
}
