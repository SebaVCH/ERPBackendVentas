package app

import (
	"os"

	"github.com/SebaVCH/ERPBackendVentas/internal/interfaces/routes"
)

func StartBackend() error {

	if err := routes.SetupRouter().Run(os.Getenv("BACKEND_PORT")); err != nil {
		return err
	}

	return nil
}
