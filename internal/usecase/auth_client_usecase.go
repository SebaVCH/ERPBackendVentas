package usecase

import (
    "net/http"
    "time"

    "github.com/SebaVCH/ERPBackendVentas/internal/infrastructure/auth"
    "github.com/SebaVCH/ERPBackendVentas/internal/repository"
    "github.com/SebaVCH/ERPBackendVentas/internal/domain"
    "github.com/gin-gonic/gin"
    "golang.org/x/crypto/bcrypt"
)

type AuthClientUsecase interface {
    Register(c *gin.Context)
    Login(c *gin.Context)
}

type authClientUsecase struct {
    Repo repository.ClienteAuthRepository
}

func NewAuthClientUsecase(repo repository.ClienteAuthRepository) AuthClientUsecase {
    return &authClientUsecase{Repo: repo}
}

type registerReq struct {
    ClienteID *int   `json:"cliente_id"` // optional: link to existing cliente
    Nombre    string `json:"nombre"`
    Apellido  string `json:"apellido"`
    Email     string `json:"email" binding:"required,email"`
    Password  string `json:"password" binding:"required,min=6"`
}

type loginReq struct {
    Email    string `json:"email" binding:"required,email"`
    Password string `json:"password" binding:"required"`
}

func (u *authClientUsecase) Register(c *gin.Context) {
    var req registerReq
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "request inválido", "error": err.Error()})
        return
    }

    // check existing
    existing, err := u.Repo.GetByEmail(req.Email)
    if err == nil && existing != nil {
        c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "email ya registrado"})
        return
    }

    // hash password
    hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "error al hashear password", "error": err.Error()})
        return
    }

    cliente := &domain.Cliente{
        Nombre: req.Nombre,
        Apellido: req.Apellido,
        Email: req.Email,
        PasswordHash: string(hash),
        CreatedAt: time.Now(),
    }

    // if cliente_id provided, set it (useful to link existing cliente)
    if req.ClienteID != nil {
        cliente.IDCliente = *req.ClienteID
    }

    if err := u.Repo.CreateCliente(cliente); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "error creando cliente", "error": err.Error()})
        return
    }

    c.JSON(http.StatusCreated, gin.H{"success": true, "message": "cliente registrado"})
}

func (u *authClientUsecase) Login(c *gin.Context) {
    var req loginReq
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "request inválido", "error": err.Error()})
        return
    }

    cliente, err := u.Repo.GetByEmail(req.Email)
    if err != nil || cliente == nil {
        c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "credenciales inválidas"})
        return
    }

    if err := bcrypt.CompareHashAndPassword([]byte(cliente.PasswordHash), []byte(req.Password)); err != nil {
        c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "credenciales inválidas"})
        return
    }

    token, err := auth.GenerateToken(cliente.IDCliente, cliente.Email, "cliente", 60*24)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "error generando token", "error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"success": true, "message": "login correcto", "data": gin.H{"token": token}})
}
