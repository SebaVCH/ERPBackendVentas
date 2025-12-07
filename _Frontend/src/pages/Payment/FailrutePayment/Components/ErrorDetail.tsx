import { Card } from "primereact/card";
import { Message } from "primereact/message";

interface ErrorDetailProps {
    errorTitle: string
    errorDescription: string
    technicalDetails?: string
}

export function ErrorDetail({ errorTitle, errorDescription, technicalDetails } : ErrorDetailProps) {
    return (
        <Card className="shadow-lg">
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        ¿Qué sucedió?
                    </h2>
                    
                    <Message 
                        severity="error" 
                        text={errorTitle}
                        className="w-full mb-4"
                    />

                    <p className="text-gray-600 mb-4">
                        {errorDescription}
                    </p>

                    {technicalDetails && technicalDetails !== errorDescription && (
                        <details className="mt-4">
                            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                                Ver detalles técnicos
                            </summary>
                            <div className="mt-2 p-3 bg-gray-50 rounded border border-gray-200">
                                <code className="text-xs text-gray-600 break-all">
                                    {technicalDetails}
                                </code>
                            </div>
                        </details>
                    )}
                </div>

                <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        ¿Qué puedes hacer?
                    </h3>
                    
                    <div className="space-y-3">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                <span className="text-blue-600 font-bold text-sm">1</span>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-800">Verifica tus datos</p>
                                <p className="text-sm text-gray-600">
                                    Asegúrate de que los datos de tu tarjeta sean correctos y que tenga fondos disponibles.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                <span className="text-blue-600 font-bold text-sm">2</span>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-800">Intenta con otro método de pago</p>
                                <p className="text-sm text-gray-600">
                                    Prueba usar otra tarjeta o selecciona un método de pago diferente.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                <span className="text-blue-600 font-bold text-sm">3</span>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-800">Contacta a tu banco</p>
                                <p className="text-sm text-gray-600">
                                    Si el problema persiste, comunícate con tu entidad bancaria para verificar que no haya restricciones.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}