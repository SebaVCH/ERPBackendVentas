package app

import (
	"os"

	"github.com/SebaVCH/ERPBackendVentas/internal/config"
	"github.com/SebaVCH/ERPBackendVentas/internal/interfaces/routes"
)

func StartBackend() error {

	if err := config.LoadEnv(); err != nil {
		return err
	}

	if err := routes.SetupRouter().Run(os.Getenv("BACKEND_PORT")); err != nil {
		return err
	}

	return nil
}
