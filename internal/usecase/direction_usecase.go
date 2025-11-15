package usecase

import (
	"net/http"

	"github.com/SebaVCH/ERPBackendVentas/internal/domain"
	"github.com/SebaVCH/ERPBackendVentas/internal/repository"
	"github.com/gin-gonic/gin"
)

type DirectionUsecase interface {
	CreateDirection(ctx *gin.Context) error
	GetDirections(ctx *gin.Context) ([]domain.Direccion, error)
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
