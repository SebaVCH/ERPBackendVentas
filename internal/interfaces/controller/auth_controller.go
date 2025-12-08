package controller

import (
    "net/http"

    "github.com/SebaVCH/ERPBackendVentas/internal/interfaces/middleware"
    "github.com/SebaVCH/ERPBackendVentas/internal/usecase"
    "github.com/gin-gonic/gin"
)

type AuthController struct {
    Usecase usecase.AuthClientUsecase
}

func NewAuthController(u usecase.AuthClientUsecase) *AuthController {
    return &AuthController{Usecase: u}
}

func (ac *AuthController) Register(c *gin.Context) {
    ac.Usecase.Register(c)
}

func (ac *AuthController) Login(c *gin.Context) {
    ac.Usecase.Login(c)
}

// CheckToken returns claims when JWT is valid; relies on JWTMiddleware running before.
func (ac *AuthController) CheckToken(c *gin.Context) {
    claims := middleware.GetClaims(c)
    if claims == nil {
        c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "token inválido"})
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "success": true,
        "data": gin.H{
            "cliente_id": claims.ClienteID,
            "email":      claims.Email,
            "role":       claims.Role,
            "expires_at": claims.ExpiresAt,
        },
    })
}
