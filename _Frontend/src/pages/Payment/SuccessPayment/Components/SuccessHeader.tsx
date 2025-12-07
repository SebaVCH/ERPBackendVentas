interface SuccessHeaderProps {
    title?: string
    subtitle?: string
}

export function SuccessHeader({ 
    title = "¡Compra realizada con éxito!", 
    subtitle = "Tu pago ha sido procesado correctamente" 
}: SuccessHeaderProps) {
    return (
        <div className="bg-linear-to-r from-green-600 via-emerald-600 to-emerald-600 p-8 text-white">
            <div className="flex items-center gap-4">
                <div className="shrink-0">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <i className="pi pi-check text-4xl"></i>
                    </div>
                </div>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold mb-2">{title}</h1>
                    <p className="text-green-50">{subtitle}</p>
                </div>
            </div>
        </div>
    );
}