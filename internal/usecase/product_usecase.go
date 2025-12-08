package usecase

import (
	"net/http"

	"github.com/SebaVCH/ERPBackendVentas/internal/domain"
	"github.com/SebaVCH/ERPBackendVentas/internal/repository"
	"github.com/gin-gonic/gin"
)

type ProductUseCase interface {
	GetProducts(ctx *gin.Context) ([]domain.Producto, error)
	GetProductsWithExtraDetails(ctx *gin.Context) ([]domain.DetallesExtra, error)
}

type productUseCase struct {
	ProductRepo repository.ProductRepository
}

func NewProductUsecase(productRepo repository.ProductRepository) ProductUseCase {
	return &productUseCase{
		ProductRepo: productRepo,
	}
}

// GetProducts implements ProductUseCase.
func (p *productUseCase) GetProducts(ctx *gin.Context) ([]domain.Producto, error) {
	products, err := p.ProductRepo.GetProducts()
	if err != nil {
		respondJSON(ctx, http.StatusInternalServerError, APIResponse{
			Success: false,
			Message: "error al obtener los productos",
			Error:   err.Error(),
		})
		return nil, err
	}
	respondJSON(ctx, http.StatusOK, APIResponse{
		Success: true,
		Message: "productos obtenidos correctamente",
		Data:    products,
	})
	return products, nil
}

// GetProductsWithExtraDetails implements ProductUseCase.
func (p *productUseCase) GetProductsWithExtraDetails(ctx *gin.Context) ([]domain.DetallesExtra, error) {
	details, err := p.ProductRepo.GetProductsWithExtraDetails()
	if err != nil {
		respondJSON(ctx, http.StatusInternalServerError, APIResponse{
			Success: false,
			Message: "error al obtener los productos con detalles extra",
			Error:   err.Error(),
		})
		return nil, err
	}
	respondJSON(ctx, http.StatusOK, APIResponse{
		Success: true,
		Message: "productos con detalles extra obtenidos correctamente",
		Data:    details,
	})
	return details, nil
}
