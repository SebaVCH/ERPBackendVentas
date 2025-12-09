/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react"
import { ProgressSpinner } from 'primereact/progressspinner'
import GenericDialog from "../../../components/Dialog"
        

type ConfirmationCheckoutDialogProps = {
    createCheckout: () => Promise<void>
    isOpen: boolean
    onClose: () => void
}

export default function ConfirmationCheckoutDialog({ isOpen, createCheckout, onClose } : ConfirmationCheckoutDialogProps) {
    
    const [ isRedirecting, setIsRedirecting ] = useState(false)
    const [ error, setError ] = useState<string | null>(null)

    const handleCreateCheckout = async () => {
        setIsRedirecting(true)
        setError(null) 
        try {
            await createCheckout()
        } catch(e) {
            console.log(e)
            const errorMessage = (e as any)?.message || 'Ocurrió un error al procesar el pago'
            setError(errorMessage)
            setIsRedirecting(false)
        }
    }

    const handleRetry = () => {
        setError(null)
        handleCreateCheckout()
    }

    const handleClose = () => {
        setError(null)
        setIsRedirecting(false)
        onClose()
    }

    return (
        <GenericDialog 
            visible={isOpen} 
            onHide={handleClose}     
            title="Confirmar pago"     
            onConfirm={error ? handleRetry : handleCreateCheckout}
            confirmLabel={error ? "Reintentar" : "Confirmar"}
            footer={isRedirecting ? <></> : undefined}  
            closable={!isRedirecting}
        >
            {error ? (
                <div className="space-y-4">
                    <div className="flex flex-col items-center justify-center text-center space-y-3 py-4">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                            <i className="pi pi-times-circle text-red-500 text-4xl"></i>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                Error al procesar el pago
                            </h3>
                            <p className="text-gray-600 text-sm">
                                {error}
                            </p>
                        </div>
                    </div>
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                        <div className="flex gap-2">
                            <i className="pi pi-info-circle text-orange-500 mt-0.5"></i>
                            <div className="text-sm text-orange-700">
                                <p className="font-semibold mb-1">Consejos:</p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Verifica tu conexión a internet</li>
                                    <li>Asegúrate de haber seleccionado una dirección</li>
                                    <li>Intenta nuevamente en unos momentos</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                </div>
            ) : !isRedirecting ? (
                <div className="space-y-4">
                    <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <i className="pi pi-info-circle text-blue-500 text-xl mt-0.5"></i>
                        <div className="text-sm text-blue-700">
                            <p className="font-semibold mb-1">Estás a punto de ser redirigido</p>
                            <p>Serás llevado a la plataforma de Mercado Pago para completar tu pago de forma segura.</p>
                        </div>
                    </div>
                    <p className="text-gray-700">¿Deseas continuar con el pago?</p>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center space-y-4 py-6">
                    <ProgressSpinner 
                        style={{width: '60px', height: '60px'}} 
                        strokeWidth="6" 
                        fill="var(--surface-ground)" 
                        animationDuration=".5s" 
                    />
                    <div className="text-center">
                        <p className="text-lg font-semibold text-gray-800 mb-1">
                            Procesando...
                        </p>
                        <p className="text-sm text-gray-600">
                            Estás siendo redirigido a Mercado Pago
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <i className="pi pi-lock"></i>
                        <span>Conexión segura</span>
                    </div>
                </div>
            )}
        </GenericDialog>
    )
}