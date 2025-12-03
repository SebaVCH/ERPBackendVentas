package routes

import (
    "github.com/SebaVCH/ERPBackendVentas/internal/interfaces/controller"
    "github.com/SebaVCH/ERPBackendVentas/internal/repository"
    "github.com/SebaVCH/ERPBackendVentas/internal/usecase"
    "github.com/gin-gonic/gin"
)

func SetupAuthRoutes(rg *gin.Engine) {
    repo := repository.NewClienteAuthRepository()
    uc := usecase.NewAuthClientUsecase(repo)
    ctrl := controller.NewAuthController(uc)

    rg.POST("/auth/register", ctrl.Register)
    rg.POST("/auth/login", ctrl.Login)
}
