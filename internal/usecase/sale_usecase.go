package usecase

import (
	"context"
	"errors"

	"github.com/SebaVCH/ERPBackendVentas/internal/domain"
	"github.com/SebaVCH/ERPBackendVentas/internal/repository"
)

type SaleUsecase interface {
	CreateSale(ctx context.Context, sale *domain.Venta) (*domain.Venta, error)
	GetSales(ctx context.Context) ([]domain.Venta, error)
	GetSale(ctx context.Context, id int) (*domain.Venta, error)
}

type saleUsecase struct {
	repo repository.SaleRepository
}

func NewSaleUsecase(r repository.SaleRepository) SaleUsecase {
	return &saleUsecase{repo: r}
}

func (u *saleUsecase) CreateSale(ctx context.Context, sale *domain.Venta) (*domain.Venta, error) {

    if sale == nil {
		return nil, errors.New("venta vacía")
	}
	if len(sale.DetallesVenta) == 0 {
		return nil, errors.New("debe incluir al menos un detalle de venta")
	}

	var total float64
	for _, d := range sale.DetallesVenta {
		if d.Cantidad <= 0 {
			return nil, errors.New("cantidad debe ser mayor a 0")
		}
		if d.PrecioUnit <= 0 {
			return nil, errors.New("precio unitario debe ser mayor a 0")
		}
		total += float64(d.Cantidad) * d.PrecioUnit
	}
	sale.Total = total

	if err := u.repo.CreateSale(sale); err != nil {
		return nil, err
	}

	created, err := u.repo.GetSale(sale.IDVenta)
	if err != nil {
		return nil, err
	}
	return created, nil
}

func (u *saleUsecase) GetSales(ctx context.Context) ([]domain.Venta, error) {
	return u.repo.GetSales()
}

func (u *saleUsecase) GetSale(ctx context.Context, id int) (*domain.Venta, error) {
	return u.repo.GetSale(id)
}