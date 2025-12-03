package controller

import (
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
