interface OrderAdditionalInfoProps {
    title?: string;
    message?: string;
}

export function OrderAdditionalInfo({ 
    title = "¿Qué sigue?",
    message = "Te enviaremos un correo con los detalles de tu compra y el seguimiento de tu pedido."
}: OrderAdditionalInfoProps) {
    return (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-gray-300">
            <div className="flex items-start gap-3">
                <i className="pi pi-info-circle text-blue-600 mt-1"></i>
                <div className="text-sm">
                    <p className="font-semibold text-gray-800 mb-1">{title}</p>
                    <p className="text-gray-600">{message}</p>
                </div>
            </div>
        </div>
    );
}