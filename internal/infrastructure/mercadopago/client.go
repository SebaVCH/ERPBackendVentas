package mercadopago

import (
    "bytes"
    "encoding/json"
    "fmt"
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

// PreferenceRequest minimal payload for Mercado Pago preference
type PreferenceRequest struct {
    Items             []PreferenceItem `json:"items"`
    ExternalReference string           `json:"external_reference,omitempty"`
    ExpirationDateFrom string          `json:"expiration_date_from,omitempty"`
    ExpirationDateTo   string          `json:"expiration_date_to,omitempty"`
}

type PreferenceItem struct {
    Title     string  `json:"title"`
    Quantity  int     `json:"quantity"`
    UnitPrice float64 `json:"unit_price"`
}

// PreferenceResponse holds the parts we need from MP
type PreferenceResponse struct {
    ID       string `json:"id"`
    InitPoint string `json:"init_point"`
}

func (c *Client) CreatePreference(amount float64, title, externalRef string, expiryMinutes int) (*PreferenceResponse, error) {
    if c.AccessToken == "" {
        return nil, fmt.Errorf("MP access token not provided")
    }

    pref := PreferenceRequest{
        Items: []PreferenceItem{{
            Title:     title,
            Quantity:  1,
            UnitPrice: amount,
        }},
        ExternalReference: externalRef,
    }

    // If expiryMinutes > 0, add expiration window
    if expiryMinutes > 0 {
        now := time.Now().UTC()
        from := now.Format(time.RFC3339)
        to := now.Add(time.Duration(expiryMinutes) * time.Minute).Format(time.RFC3339)
        pref.ExpirationDateFrom = from
        pref.ExpirationDateTo = to
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

    if resp.StatusCode < 200 || resp.StatusCode >= 300 {
        return nil, fmt.Errorf("mercadopago responded with status %d", resp.StatusCode)
    }

    var pr PreferenceResponse
    if err := json.NewDecoder(resp.Body).Decode(&pr); err != nil {
        return nil, err
    }
    return &pr, nil
}
