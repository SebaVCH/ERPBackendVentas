import  { Button } from "primereact/button";
import  { Card } from "primereact/card";
import  { Divider } from "primereact/divider";

interface OrderPriceSummaryProps {
    subtotal: number;
    iva: number;
    total: number;
    onViewOrders?: () => void;
    onGoHome?: () => void;
}

export function OrderPriceSummary({ 
    subtotal, 
    iva, 
    total,
    onViewOrders,
    onGoHome
}: OrderPriceSummaryProps) {
    return (
        <Card className="shadow-lg sticky top-4">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
                Resumen del pedido
            </h2>

            <div className="space-y-4">
                <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold">
                        ${subtotal.toLocaleString('es-CL')}
                    </span>
                </div>

                <div className="flex justify-between text-gray-600">
                    <span>Envío</span>
                    <span className="font-semibold text-green-600">Gratis</span>
                </div>

                <div className="flex justify-between text-gray-600">
                    <span>IVA (19%)</span>
                    <span className="font-semibold">
                        ${iva.toLocaleString('es-CL')}
                    </span>
                </div>

                <Divider />

                <div className="flex justify-between items-center text-xl">
                    <span className="font-bold text-gray-800">Total</span>
                    <span className="font-bold text-blue-600">
                        ${total.toLocaleString('es-CL')}
                    </span>
                </div>

                <Divider />

                <div className="flex flex-col space-y-3 gap-2">                    
                    <Button
                        label="Ver mis pedidos"
                        icon="pi pi-list"
                        className="w-full"
                        severity="secondary"
                        outlined
                        onClick={onViewOrders}
                    />
                    <Button
                        label="Volver al inicio"
                        icon="pi pi-home"
                        className="w-full"
                        onClick={onGoHome}
                    />
                </div>
            </div>
        </Card>
    );
}