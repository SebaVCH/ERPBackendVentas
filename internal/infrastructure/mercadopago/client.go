package mercadopago

import (
    "bytes"
    "encoding/json"
    "fmt"
    "io"
    "net/http"
    "os"
    "time"
)

type Client struct {
    AccessToken string
    HTTPClient  *http.Client
}

func NewClientFromEnv() *Client {
    token := os.Getenv("MP_ACCESS_TOKEN")
    return &Client{
        AccessToken: token,
        HTTPClient: &http.Client{
            Timeout: 10 * time.Second,
        },
    }
}

type BackUrls struct {
	Success string `json:"success"`
	Failure string `json:"failure"`
	Pending string `json:"pending"`
}

type Payer struct {
	Name    string `json:"name,omitempty"`
	Surname string `json:"surname,omitempty"`
	Email   string `json:"email,omitempty"`
}


// PreferenceRequest minimal payload for Mercado Pago preference
type PreferenceRequest struct {
    Items             []PreferenceItem `json:"items"`
    ExternalReference string           `json:"external_reference,omitempty"`
    DateOfExpiration  string           `json:"date_of_expiration,omitempty"`
    BackUrls          *BackUrls        `json:"back_urls,omitempty"`
    AutoReturn        string           `json:"auto_return,omitempty"`
    Payer             *Payer           `json:"payer,omitempty"`
    ExpirationDateTo   string          `json:"expiration_date_to,omitempty"`
}

type PreferenceItem struct {
    Title     string  `json:"title"`
    Quantity  int     `json:"quantity"`
    UnitPrice float64 `json:"unit_price"`
    CurrencyId  string  `json:"currency_id,omitempty"`
}

// PreferenceResponse holds the parts we need from MP
type PreferenceResponse struct {
    ID       string `json:"id"`
    InitPoint string `json:"init_point"`
	SandboxInit      string `json:"sandbox_init_point"`
	DateCreated      string `json:"date_created"`
	DateOfExpiration string `json:"date_of_expiration"`
}

func (c *Client) CreatePreference(amount float64, title, externalRef string, expiryMinutes int) (*PreferenceResponse, error) {
    if c.AccessToken == "" {
        return nil, fmt.Errorf("MP access token not provided")
    }
    if os.Getenv("MP_BACK_URL") == "" {
		return nil, fmt.Errorf("BACK URL not provided")
	}

    backURL := os.Getenv("MP_BACK_URL")
    pref := PreferenceRequest{
        Items: []PreferenceItem{{
            Title:     title,
            Quantity:  1,
            UnitPrice: amount,
        }},
        ExternalReference: externalRef,
        AutoReturn:        "approved",
		BackUrls: &BackUrls{
			Success: backURL + "/payments/success",
			Failure: backURL + "/payments/failure",
			Pending: backURL + "/payments/pending",
		},
		Payer: &Payer{
			Email: "test@test.com",
		},
    }

    // If expiryMinutes > 0, add expiration window
    if expiryMinutes > 0 {
		expiryTime := time.Now().UTC().Add(time.Duration(expiryMinutes) * time.Minute)
		pref.DateOfExpiration = expiryTime.Format(time.RFC3339)
    }

    payload, err := json.Marshal(pref)
    if err != nil {
        return nil, err
    }

    req, err := http.NewRequest("POST", "https://api.mercadopago.com/checkout/preferences", bytes.NewBuffer(payload))
    if err != nil {
        return nil, err
    }
    req.Header.Set("Content-Type", "application/json")
    req.Header.Set("Authorization", "Bearer "+c.AccessToken)

    resp, err := c.HTTPClient.Do(req)
    if err != nil {
        return nil, err
    }
    defer resp.Body.Close()

    // Read entire body for better error messages and decoding
    bodyBytes, err := io.ReadAll(resp.Body)
    if err != nil {
        return nil, err
    }

    if resp.StatusCode < 200 || resp.StatusCode >= 300 {
        return nil, fmt.Errorf("mercadopago responded with status %d: %s", resp.StatusCode, string(bodyBytes))
    }

    var pr PreferenceResponse
    if err := json.Unmarshal(bodyBytes, &pr); err != nil {
        return nil, err
    }
    return &pr, nil
}
