import { Button } from "primereact/button"
import { Card } from "primereact/card"

interface ErrorStateProps {
    title: string
    message: string
    onRetry?: () => void
    onGoHome?: () => void
    showRetry?: boolean
}

export function ErrorState({ title, message, onRetry, onGoHome, showRetry } : ErrorStateProps) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 via-gray-200 to-gray-50 px-4">
            <div className="max-w-md w-full">
                <Card className="shadow-xl">
                    <div className="text-center py-6">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
                            <i className="pi pi-times-circle text-red-600 text-4xl"></i>
                        </div>
                        
                        <h2 className="text-2xl font-bold text-gray-800 mb-3">
                            {title}
                        </h2>
                        
                        <p className="text-gray-600 mb-6">
                            {message}
                        </p>

                        <div className="flex flex-col gap-3">
                            {showRetry && onRetry && (
                                <Button
                                    label="Reintentar"
                                    icon="pi pi-refresh"
                                    onClick={onRetry}
                                    severity="contrast"
                                    className="w-full"
                                />
                            )}
                            
                            <Button
                                label="Volver al inicio"
                                icon="pi pi-home"
                                onClick={onGoHome || (() => window.location.href = '/')}
                                severity={showRetry ? "secondary" : "contrast"}
                                outlined={showRetry}
                                className="w-full"
                            />
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}