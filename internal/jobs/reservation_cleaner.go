package jobs

import (
    "log"
    "time"

    "github.com/SebaVCH/ERPBackendVentas/internal/domain"
    "github.com/SebaVCH/ERPBackendVentas/internal/infrastructure/database"
)

func StartReservationCleaner(interval time.Duration) {
	
    ticker := time.NewTicker(interval)
    defer ticker.Stop()
    db := database.DB
    for range ticker.C {
        var dbNow time.Time
        if err := db.Raw("SELECT now()").Scan(&dbNow).Error; err == nil {
            log.Printf("reservation cleaner running, db now: %v", dbNow)
        } else {
            log.Printf("reservation cleaner: failed to query db now: %v", err)
        }

        if err := db.Where("fechareserva <= now()").Delete(&domain.CarritoReserva{}).Error; err != nil {
            log.Printf("reservation cleaner error: %v", err)
        }
    }
}
