import { ErrorHeader } from "./Components/ErrorHeader";
import { ErrorDetail } from "./Components/ErrorDetail";
import { ErrorActions } from "./Components/ErrorActions";
import { useNavigate } from "react-router-dom";
import { AdditionalInfo } from "../../../components/AditionalInfo";

export default function FailurePayment() {
    
    const navigate = useNavigate()
    const searchParams = new URLSearchParams(window.location.search);
    const errorMessage = searchParams.get("message") || "Hubo un problema al procesar tu pago"
    
    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 via-gray-200 to-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <ErrorHeader />
                <div className="grid gap-6">
                    <ErrorDetail errorTitle={errorMessage} errorDescription={``} />
                    <ErrorActions onRetryPayment={() => navigate('/mi-carrito')} onGoHome={() => navigate('/')} />
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