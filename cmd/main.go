package main

import (
	"log/slog"
	"os"

	"github.com/SebaVCH/ERPBackendVentas/cmd/app"
	"github.com/SebaVCH/ERPBackendVentas/internal/config"
	"github.com/SebaVCH/ERPBackendVentas/internal/infrastructure/database"
)

func main() {

	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))
	slog.SetDefault(logger)

	if err := config.LoadEnv(); err != nil {
		slog.Error("Error al cargar las variables de entorno.", "error", err)
		os.Exit(1)
	}

	if err := database.StartDB(); err != nil {
		slog.Error("Error al conectar con la base de datos.", "error", err)
		os.Exit(1)
	}

	if err := app.StartBackend(); err != nil {
		slog.Error("Error al iniciar el backend.", "error", err)
		os.Exit(1)
	}

	slog.Info("Backend iniciado correctamente")

}
