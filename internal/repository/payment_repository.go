package repository

import (
    "github.com/SebaVCH/ERPBackendVentas/internal/infrastructure/mercadopago"
)

type PaymentRepository interface {
    CreatePreference(amount float64, title, externalRef string, expiryMinutes int) (initPoint string, preferenceID string, err error)
}

type paymentRepository struct {
    mpClient *mercadopago.Client
}

func NewPaymentRepository() PaymentRepository {
    return &paymentRepository{
        mpClient: mercadopago.NewClientFromEnv(),
    }
}

func (p *paymentRepository) CreatePreference(amount float64, title, externalRef string, expiryMinutes int) (string, string, error) {
    pr, err := p.mpClient.CreatePreference(amount, title, externalRef, expiryMinutes)
    if err != nil {
        return "", "", err
    }
    return pr.InitPoint, pr.ID, nil
}
