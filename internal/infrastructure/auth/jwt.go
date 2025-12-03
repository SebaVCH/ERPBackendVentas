package auth

import (
    "os"
    "time"

    "github.com/golang-jwt/jwt/v5"
)

type Claims struct {
    ClienteID int    `json:"cliente_id"`
    Email     string `json:"email"`
    Role      string `json:"role"`
    jwt.RegisteredClaims
}

func jwtSecret() []byte {
    s := os.Getenv("JWT_SECRET")
    if s == "" {
        s = "dev-secret"
    }
    return []byte(s)
}

func GenerateToken(clienteID int, email, role string, expiryMinutes int) (string, error) {
    now := time.Now()
    claims := Claims{
        ClienteID: clienteID,
        Email:     email,
        Role:      role,
        RegisteredClaims: jwt.RegisteredClaims{
            IssuedAt:  jwt.NewNumericDate(now),
            ExpiresAt: jwt.NewNumericDate(now.Add(time.Duration(expiryMinutes) * time.Minute)),
            Issuer:    "erp-backend",
        },
    }
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    return token.SignedString(jwtSecret())
}

func ValidateToken(tokenStr string) (*Claims, error) {
    token, err := jwt.ParseWithClaims(tokenStr, &Claims{}, func(t *jwt.Token) (interface{}, error) {
        return jwtSecret(), nil
    })
    if err != nil {
        return nil, err
    }
    if claims, ok := token.Claims.(*Claims); ok && token.Valid {
        return claims, nil
    }
    return nil, jwt.ErrTokenInvalidClaims
}
