package repository

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/SebaVCH/ERPBackendVentas/internal/infrastructure/mercadopago"
)

type PaymentDetail struct {
	ID                int64      `json:"id"`
	Status            string     `json:"status"`
	StatusDetail      string     `json:"status_detail"`
	Amount            float64    `json:"transaction_amount"`
	Currency          string     `json:"currency_id"`
	PaymentType       string     `json:"payment_type_id"`
	Description       string     `json:"description"`
	DateCreated       string     `json:"date_created"`
	DateApproved      string     `json:"date_approved,omitempty"`
	ExternalReference string     `json:"external_reference,omitempty"`
	Card              *CardInfo  `json:"card,omitempty"`
	Payer             *PayerInfo `json:"payer,omitempty"`
}

type CardInfo struct {
	LastFourDigits string `json:"last_four_digits,omitempty"`
	FirstSixDigits string `json:"first_six_digits,omitempty"`
}

type PayerInfo struct {
	Email string `json:"email,omitempty"`
	ID    string `json:"id,omitempty"`
}

type PaymentRepository interface {
	CreatePreference(amount float64, title, externalRef, customerEmail string, expiryMinutes int) (initPoint string, preferenceID string, err error)
	GetPaymentDetail(paymentID int64) (*PaymentDetail, error)
}

type paymentRepository struct {
	mpClient *mercadopago.Client
}

func NewPaymentRepository() PaymentRepository {
	return &paymentRepository{
		mpClient: mercadopago.NewClientFromEnv(),
	}
}

func (p *paymentRepository) CreatePreference(amount float64, title, externalRef, customerEmail string, expiryMinutes int) (string, string, error) {
	pr, err := p.mpClient.CreatePreference(amount, title, externalRef, customerEmail, expiryMinutes)
	if err != nil {
		return "", "", err
	}
	return pr.InitPoint, pr.ID, nil
}

func (p *paymentRepository) GetPaymentDetail(paymentID int64) (*PaymentDetail, error) {
	if p.mpClient.AccessToken == "" {
		return nil, fmt.Errorf("MP access token not provided")
	}

	url := fmt.Sprintf("https://api.mercadopago.com/v1/payments/%d", paymentID)

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, fmt.Errorf("error creating request: %w", err)
	}

	req.Header.Set("Authorization", "Bearer "+p.mpClient.AccessToken)
	req.Header.Set("Content-Type", "application/json")

	resp, err := p.mpClient.HTTPClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("error making request: %w", err)
	}
	defer resp.Body.Close()

	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("error reading response: %w", err)
	}

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return nil, fmt.Errorf("mercadopago responded with status %d: %s", resp.StatusCode, string(bodyBytes))
	}

	var detail PaymentDetail
	if err := json.Unmarshal(bodyBytes, &detail); err != nil {
		return nil, fmt.Errorf("error unmarshaling response: %w", err)
	}

    detail.StatusDetail = getUserFriendlyMessage(detail.StatusDetail)

	return &detail, nil
}


func getUserFriendlyMessage(statusDetail string) string {
	messages := map[string]string{
		"cc_rejected_insufficient_amount":      "Fondos insuficientes en tu tarjeta",
		"cc_rejected_bad_filled_security_code": "Código de seguridad incorrecto",
		"cc_rejected_bad_filled_date":          "Fecha de vencimiento incorrecta",
		"cc_rejected_bad_filled_other":         "Revisa los datos de tu tarjeta",
		"cc_rejected_call_for_authorize":       "Debes autorizar el pago con tu banco",
		"cc_rejected_card_disabled":            "Tu tarjeta está deshabilitada",
		"cc_rejected_duplicated_payment":       "Ya realizaste este pago",
		"cc_rejected_high_risk":                "Pago rechazado por seguridad",
		"cc_rejected_max_attempts":             "Superaste el límite de intentos",
		"cc_rejected_blacklist":                "No pudimos procesar tu pago",
		"cc_rejected_card_error":               "Error al procesar la tarjeta",
		"rejected_by_bank":                     "Tu banco rechazó el pago",
		"rejected_insufficient_data":           "Información incompleta",
	}

	if msg, ok := messages[statusDetail]; ok {
		return msg
	}

	return "El pago fue rechazado. Por favor intenta con otro medio de pago"
}