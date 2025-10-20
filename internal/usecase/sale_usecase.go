package usecase

import (
    "context"
    "errors"

    "github.com/SebaVCH/ERPBackendVentas/internal/domain"
    "github.com/SebaVCH/ERPBackendVentas/internal/repository"
)

type SaleUsecase interface {
    CreateSale(ctx context.Context, sale *domain.Ventas) (*domain.Ventas, error)
    GetSales(ctx context.Context) ([]domain.Ventas, error)
    GetSale(ctx context.Context, id int) (*domain.Ventas, error)
}

type saleUsecase struct {
    repo repository.SaleRepository
}

func NewSaleUsecase(r repository.SaleRepository) SaleUsecase {
    return &saleUsecase{repo: r}
}

func (u *saleUsecase) CreateSale(ctx context.Context, sale *domain.Ventas) (*domain.Ventas, error) {
    if sale == nil {
        return nil, errors.New("venta vacía")
    }
    if len(sale.DetallesVenta) == 0 {
        return nil, errors.New("detalles_venta vacíos")
    }

    var total float64
    for _, d := range sale.DetallesVenta {
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

func (u *saleUsecase) GetSales(ctx context.Context) ([]domain.Ventas, error) {
    return u.repo.GetSales()
}

func (u *saleUsecase) GetSale(ctx context.Context, id int) (*domain.Ventas, error) {
    return u.repo.GetSale(id)
}