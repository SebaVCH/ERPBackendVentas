interface ErrorHeaderProps {
    title?: string
    subtitle?: string
}

export function ErrorHeader({ title = "No se pudo procesar tu pago", subtitle = "Ocurrió un problema al intentar completar tu compra" } : ErrorHeaderProps) {
    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
            <div className="bg-linear-to-r from-red-600 via-red-500 to-red-600 p-8 text-white">
                <div className="flex items-center gap-4">
                    <div className="shrink-0">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                            <i className="pi pi-times text-4xl"></i>
                        </div>
                    </div>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold mb-2">{title}</h1>
                        <p className="text-red-50">{subtitle}</p>
                    </div>
                </div>
            </div>

            <div className="px-8 pt-6 pb-4 bg-amber-50 border-b border-amber-200">
                <div className="flex items-center gap-3">
                    <i className="pi pi-shopping-cart text-amber-600 text-xl"></i>
                    <div>
                        <p className="font-semibold text-gray-800">Tus productos están seguros</p>
                        <p className="text-sm text-gray-600">
                            No se realizó ningún cargo. Los productos siguen en tu carrito.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}