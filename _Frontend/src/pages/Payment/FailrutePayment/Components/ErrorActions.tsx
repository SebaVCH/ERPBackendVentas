import  { Button } from "primereact/button";
import  { Card } from "primereact/card";
import { Divider } from "primereact/divider";

interface ErrorActionsProps {
    onRetryPayment: () => void
    onGoHome: () => void
}

export function ErrorActions({ onRetryPayment, onGoHome }: ErrorActionsProps) {
    return (
        <Card className="shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
                Acciones disponibles
            </h3>

            <div className="space-y-3">
                <Button
                    label="Volver al carrito e intentar de nuevo"
                    icon="pi pi-shopping-cart"
                    onClick={onRetryPayment}
                    severity="contrast"
                    className="w-full"
                />
                <Divider className="my-4!" />
                <Button
                    label="Volver al inicio"
                    icon="pi pi-home"
                    onClick={onGoHome}
                    className="w-full"
                />
            </div>
        </Card>
    );
}