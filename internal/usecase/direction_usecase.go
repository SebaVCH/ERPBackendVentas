package usecase

import (
	"net/http"
	"strconv"

	"github.com/SebaVCH/ERPBackendVentas/internal/domain"
	"github.com/SebaVCH/ERPBackendVentas/internal/repository"
	"github.com/gin-gonic/gin"
)

type DirectionUsecase interface {
	CreateDirection(ctx *gin.Context) error
	GetDirections(ctx *gin.Context) ([]domain.Direccion, error)
	GetDirectionByID(ctx *gin.Context) error
	GetDirectionsByClientID(ctx *gin.Context) ([]domain.Direccion, error)
	UpdateDirection(ctx *gin.Context) error
	DeleteDirection(ctx *gin.Context) error
	CreateMany(ctx *gin.Context) error
}

type directionUsecase struct {
	directionRepo repository.DirectionRepository
}

func NewDirectionUsecase(directionRepo repository.DirectionRepository) DirectionUsecase {
	return &directionUsecase{
		directionRepo: directionRepo,
	}
}

type DirectionRequest struct {
	IDCliente    int     `json:"id_cliente" `
	Direccion    string  `json:"direccion" `
	Numero       string  `json:"numero" `
	Ciudad       string  `json:"ciudad" `
	Region       string  `json:"region" `
	Comuna       string  `json:"comuna" `
	CodigoPostal string  `json:"codigo_postal" `
	Etiqueta     *string `json:"etiqueta,omitempty" `
}

func (u *directionUsecase) CreateDirection(ctx *gin.Context) error {
	var req DirectionRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		respondJSON(ctx, http.StatusBadRequest, APIResponse{
			Success: false,
			Message: "request invalido",
			Error:   err.Error(),
		})
		return nil
	}

	if req.IDCliente <= 0 {
		respondJSON(ctx, http.StatusBadRequest, APIResponse{
			Success: false,
			Message: "id_cliente debe ser mayor a 0",
			Error:   "El id_cliente proporcionado es invalido",
		})
		return nil
	}

	direccion := &domain.Direccion{
		IDCliente:    req.IDCliente,
		Direccion:    req.Direccion,
		Numero:       req.Numero,
		Ciudad:       req.Ciudad,
		Region:       req.Region,
		Comuna:       req.Comuna,
		CodigoPostal: req.CodigoPostal,
		Etiqueta:     req.Etiqueta,
	}

	err := u.directionRepo.CreateDirection(direccion)
	if err != nil {
		respondJSON(ctx, http.StatusInternalServerError, APIResponse{
			Success: false,
			Message: "error al crear la direccion",
			Error:   err.Error(),
		})
		return err
	}

	respondJSON(ctx, http.StatusCreated, APIResponse{
		Success: true,
		Message: "direccion creada exitosamente",
		Data:    direccion,
	})
	return nil
}

func (u *directionUsecase) GetDirections(ctx *gin.Context) ([]domain.Direccion, error) {

	directions, err := u.directionRepo.GetDirections()
	if err != nil {
		respondJSON(ctx, http.StatusInternalServerError, APIResponse{
			Success: false,
			Message: "error al obtener las direcciones",
			Error:   err.Error(),
		})
		return nil, err
	}

	respondJSON(ctx, http.StatusOK, APIResponse{
		Success: true,
		Message: "direcciones obtenidas exitosamente",
		Data:    directions,
	})
	return directions, nil

}

func (u *directionUsecase) GetDirectionsByClientID(ctx *gin.Context) ([]domain.Direccion, error) {

	idStr := ctx.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		respondJSON(ctx, http.StatusBadRequest, APIResponse{
			Success: false,
			Message: "id_cliente inválido",
			Error:   "se requiere un id_numérico mayor a 0"})
		return nil, err
	}

	directions, err := u.directionRepo.GetDirectionsByClientID(id)
	if err != nil {
		respondJSON(ctx, http.StatusBadRequest, APIResponse{
			Success: false,
			Message: "Error al obtener las direcciones",
			Error:   err.Error()})
		return nil, err
	}
	respondJSON(ctx, http.StatusOK, APIResponse{
		Success: true,
		Message: "Direcciones obtenidas exitosamente",
		Data:    directions,
	})
	return directions, nil
}

func (u *directionUsecase) UpdateDirection(ctx *gin.Context) error {
	idStr := ctx.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		respondJSON(ctx, http.StatusBadRequest, APIResponse{
			Success: false,
			Message: "id de la dirección inválido",
			Error:   "se requiere un id_numérico mayor a 0"})
		return err
	}

	var req DirectionRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		respondJSON(ctx, http.StatusBadRequest, APIResponse{
			Success: false,
			Message: "request invalido",
			Error:   err.Error(),
		})
		return nil
	}

	direccion := &domain.Direccion{
		IDDireccion:  id,
		IDCliente:    req.IDCliente,
		Direccion:    req.Direccion,
		Numero:       req.Numero,
		Ciudad:       req.Ciudad,
		Region:       req.Region,
		Comuna:       req.Comuna,
		CodigoPostal: req.CodigoPostal,
		Etiqueta:     req.Etiqueta,
	}

	if err = u.directionRepo.UpdateDirection(id, direccion); err != nil {
		respondJSON(ctx, http.StatusInternalServerError, APIResponse{
			Success: false,
			Message: "Error interno",
			Error:   err.Error(),
		})
		return err
	}

	respondJSON(ctx, http.StatusOK, APIResponse{
		Success: true,
		Message: "direcciones obtenidas exitosamente",
		Data:    direccion,
	})

	return nil

}

func (u *directionUsecase) DeleteDirection(ctx *gin.Context) error {
	idStr := ctx.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		respondJSON(ctx, http.StatusBadRequest, APIResponse{
			Success: false,
			Message: "id_dirección inválido",
			Error:   "se requiere un id_numérico mayor a 0"})
		return err
	}
	if err = u.directionRepo.DeleteDirection(id); err != nil {
		respondJSON(ctx, http.StatusInternalServerError, APIResponse{
			Success: false,
			Message: "Error interno",
			Error:   err.Error(),
		})
		return err
	}

	respondJSON(ctx, http.StatusOK, APIResponse{
		Success: true,
		Message: "Dirección Eliminado Correctamente",
		Data:    "Eliminado Correctamente",
	})
	return nil
}

func (u *directionUsecase) GetDirectionByID(ctx *gin.Context) error {
	idStr := ctx.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		respondJSON(ctx, http.StatusBadRequest, APIResponse{
			Success: false,
			Message: "id_dirección inválido",
			Error:   "se requiere un id_numérico mayor a 0"})
		return err
	}

	direction, err := u.directionRepo.GetDirectionByID(id)
	if err != nil {
		respondJSON(ctx, http.StatusInternalServerError, APIResponse{
			Success: false,
			Message: "Error del servidor",
			Error:   err.Error()})
		return err
	}

	respondJSON(ctx, http.StatusOK, APIResponse{
		Success: true,
		Message: "OK",
		Data:    direction,
	})
	return nil
}

func (u *directionUsecase) CreateMany(ctx *gin.Context) error {
	var req []DirectionRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		respondJSON(ctx, http.StatusBadRequest, APIResponse{
			Success: false,
			Message: "request invalido",
			Error:   err.Error(),
		})
		return nil
	}

	var direcciones []domain.Direccion
	for _, d := range req {
		direccion := domain.Direccion{
			IDCliente:    d.IDCliente,
			Direccion:    d.Direccion,
			Numero:       d.Numero,
			Ciudad:       d.Ciudad,
			Region:       d.Region,
			Comuna:       d.Comuna,
			CodigoPostal: d.CodigoPostal,
			Etiqueta:     d.Etiqueta,
		}
		direcciones = append(direcciones, direccion)
	}

	err := u.directionRepo.CreateMany(direcciones)
	if err != nil {
		respondJSON(ctx, http.StatusInternalServerError, APIResponse{
			Success: false,
			Message: "error al crear las direcciones",
			Error:   err.Error(),
		})
		return err
	}

	respondJSON(ctx, http.StatusCreated, APIResponse{
		Success: true,
		Message: "direcciones creadas exitosamente",
		Data:    direcciones,
	})
	return nil
}
