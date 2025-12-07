import { useEffect, useState } from "react";
import { ErrorHeader } from "./Components/ErrorHeader";
import { ErrorDetail } from "./Components/ErrorDetail";
import { ErrorActions } from "./Components/ErrorActions";
import { useNavigate } from "react-router-dom";
import { AdditionalInfo } from "../../../components/AditionalInfo";

export default function FailurePayment() {
    
    const navigate = useNavigate()
    const searchParams = new URLSearchParams(window.location.search);
    const errorMessage = searchParams.get("msg") || "Hubo un problema al procesar tu pago";
    
    const [errorDetails, setErrorDetails] = useState<string>("");

    useEffect(() => {
        // Decodificar el mensaje de error si viene URL encoded
        setErrorDetails(decodeURIComponent(errorMessage));
    }, [errorMessage]);

    // Mapeo de mensajes comunes a explicaciones más amigables
    const getFriendlyMessage = (msg: string): { title: string; description: string } => {
        const lowerMsg = msg.toLowerCase();
        
        if (lowerMsg.includes("insufficient") || lowerMsg.includes("fondos") || lowerMsg.includes("saldo")) {
            return {
                title: "Fondos insuficientes",
                description: "Tu tarjeta no tiene saldo suficiente para completar esta compra."
            };
        }
        
        if (lowerMsg.includes("declined") || lowerMsg.includes("rechazada") || lowerMsg.includes("denegada")) {
            return {
                title: "Pago rechazado",
                description: "Tu entidad bancaria rechazó la transacción. Por favor, contacta a tu banco."
            };
        }
        
        if (lowerMsg.includes("expired") || lowerMsg.includes("expirada") || lowerMsg.includes("vencida")) {
            return {
                title: "Tarjeta expirada",
                description: "La tarjeta que intentaste usar ha expirado. Por favor, usa otra tarjeta."
            };
        }
        
        if (lowerMsg.includes("timeout") || lowerMsg.includes("tiempo")) {
            return {
                title: "Tiempo de espera agotado",
                description: "La transacción tardó demasiado tiempo. Por favor, intenta nuevamente."
            };
        }

        if (lowerMsg.includes("cancelled") || lowerMsg.includes("cancelad")) {
            return {
                title: "Pago cancelado",
                description: "Cancelaste el proceso de pago. Tus productos siguen en el carrito."
            };
        }
        
        return {
            title: "Error en el pago",
            description: msg
        };
    };

    const { title, description } = getFriendlyMessage(errorDetails);

    const handleRetryPayment = () => {
        // Redirigir al carrito donde están los productos
        window.location.href = '/cart';
    };


    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 via-gray-200 to-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <ErrorHeader />
                <div className="grid gap-6">
                    <ErrorDetail errorTitle={title} errorDescription={description} />
                    <ErrorActions onRetryPayment={handleRetryPayment} onGoHome={() => navigate('/')} />
                    <AdditionalInfo
                        title="¿Necesitas ayuda?"
                        message="Nuestro equipo de soporte está disponible para ayudarte"
                        icon="pi pi-question-circle"
                    >
                        <div className="flex flex-wrap pt-2 gap-4 text-gray-600">
                            <span>
                                <i className="pi pi-envelope mr-2"></i>
                                soporte@erpventassii.cl
                            </span>
                            <span>
                                <i className="pi pi-phone mr-2"></i>
                                +56 9 1234 5678
                            </span>
                        </div>
                    </AdditionalInfo>
                </div>
            </div>
        </div>
    );
}