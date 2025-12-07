import { Card } from "primereact/card";
import type { OrderProduct } from "../../../../types/Order";


interface OrderItemsListProps {
    items: OrderProduct[];
}

export function OrderItemsList({ items }: OrderItemsListProps) {
    return (
        <Card className="shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Detalles de tu compra
            </h2>

            <div className="space-y-4">
                {items.map((item) => (
                    <OrderItemCard key={item.product.productID} item={item} />
                ))}
            </div>
        </Card>
    );
}

// Sub-componente
function OrderItemCard({ item }: { item: OrderProduct }) {
    return (
        <div className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                <i className="pi pi-box text-gray-400 text-2xl"></i>
            </div>

            <div className="flex-1">
                <h3 className="font-semibold text-gray-800 mb-1">
                    {item.product.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                    {item.product.description}
                </p>
                <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-600">
                        Cantidad: <strong>{item.amount}</strong>
                    </span>
                    <span className="text-gray-600">
                        Precio unitario: <strong>${item.unitPrice.toLocaleString('es-CL')}</strong>
                    </span>
                </div>
            </div>

            <div className="text-right flex-shrink-0">
                <p className="text-lg font-bold text-blue-600">
                    ${(item.unitPrice * item.amount).toLocaleString('es-CL')}
                </p>
            </div>
        </div>
    );
}