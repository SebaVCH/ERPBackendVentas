package middleware

import (
	"net/http"
	"strings"

	"github.com/SebaVCH/ERPBackendVentas/internal/infrastructure/auth"
	"github.com/gin-gonic/gin"
)

const (
	ClaimsContextKey = "claims"
)

// JWTMiddleware validates JWT token from Authorization header and extracts claims
func JWTMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "token no proporcionado"})
			c.Abort()
			return
		}

		// Extract Bearer token
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "formato de token inválido"})
			c.Abort()
			return
		}

		tokenStr := parts[1]
		claims, err := auth.ValidateToken(tokenStr)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "token inválido o expirado", "error": err.Error()})
			c.Abort()
			return
		}

		// Store claims in context for use in handlers
		c.Set(ClaimsContextKey, claims)
		c.Next()
	}
}

// GetClaims extracts the JWT claims from Gin context
func GetClaims(c *gin.Context) *auth.Claims {
	val, exists := c.Get(ClaimsContextKey)
	if !exists {
		return nil
	}
	claims, ok := val.(*auth.Claims)
	if !ok {
		return nil
	}
	return claims
}
