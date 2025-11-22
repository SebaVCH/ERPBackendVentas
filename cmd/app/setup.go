package app

import (
	"os"
	"time"

	"github.com/SebaVCH/ERPBackendVentas/internal/interfaces/routes"
	"github.com/SebaVCH/ERPBackendVentas/internal/jobs"
)

func StartBackend() error {
	
	go jobs.StartReservationCleaner(1 * time.Minute)

	if err := routes.SetupRouter().Run(os.Getenv("BACKEND_PORT")); err != nil {
		return err
	}

	return nil
}
