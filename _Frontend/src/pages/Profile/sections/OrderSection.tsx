import { Card } from "primereact/card";
import { DataView } from "primereact/dataview";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";

type OrderWithDetails = {
    id: number;
    date: string;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    total: number;
    items: number;
    products: {
        name: string;
        quantity: number;
        price: number;
    }[];
}

export type OrderSectionProps = {
    clientID: number
}

const mockOrders: OrderWithDetails[] = [
    {
        id: 1001,
        date: '2024-11-28',
        status: 'delivered',
        total: 1599.98,
        items: 2,
        products: [
            { name: 'Laptop Dell XPS 15', quantity: 1, price: 1299.99 },
            { name: 'Mouse Logitech MX Master', quantity: 1, price: 299.99 }
        ]
    },
    {
        id: 1002,
        date: '2024-11-30',
        status: 'shipped',
        total: 899.99,
        items: 1,
        products: [
            { name: 'Monitor Samsung 27"', quantity: 1, price: 899.99 }
        ]
    },
    {
        id: 1003,
        date: '2024-12-01',
        status: 'processing',
        total: 549.97,
        items: 3,
        products: [
            { name: 'Teclado Mecánico RGB', quantity: 1, price: 149.99 },
            { name: 'Mousepad XXL', quantity: 1, price: 49.99 },
            { name: 'Webcam HD 1080p', quantity: 1, price: 349.99 }
        ]
    },
    {
        id: 1004,
        date: '2024-12-03',
        status: 'pending',
        total: 2499.99,
        items: 1,
        products: [
            { name: 'iPhone 15 Pro Max', quantity: 1, price: 2499.99 }
        ]
    }
];

const getStatusSeverity = (status: OrderWithDetails['status']) => {
    switch (status) {
        case 'delivered':
            return 'success';
        case 'shipped':
            return 'info';
        case 'processing':
            return 'warning';
        case 'pending':
            return 'secondary';
        case 'cancelled':
            return 'danger';
        default:
            return 'secondary';
    }
};

const getStatusLabel = (status: OrderWithDetails['status']) => {
    switch (status) {
        case 'delivered':
            return 'Entregado';
        case 'shipped':
            return 'Enviado';
        case 'processing':
            return 'Procesando';
        case 'pending':
            return 'Pendiente';
        case 'cancelled':
            return 'Cancelado';
        default:
            return status;
    }
};

export default function OrderSection({ clientID } : OrderSectionProps) {
    
    const itemTemplate = (order: OrderWithDetails) => {
        return (
            <div className="border-b border-gray-200 pb-6 mb-6 last:border-b-0 last:pb-0 last:mb-0">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Pedido #{order.id}
                            </h3>
                            <Tag
                                value={getStatusLabel(order.status)}
                                severity={getStatusSeverity(order.status)}
                            />
                        </div>
                        <p className="text-sm text-gray-600">
                            Fecha: {new Date(order.date).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">
                            ${order.total.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600">
                            {order.items} {order.items === 1 ? 'producto' : 'productos'}
                        </p>
                    </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Productos:</h4>
                    <div className="space-y-2">
                        {order.products.map((product, index) => (
                            <div key={index} className="flex justify-between items-center text-sm">
                                <span className="text-gray-800">
                                    {product.quantity}x {product.name}
                                </span>
                                <span className="font-semibold text-gray-900">
                                    ${product.price.toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button
                        label="Ver Detalles"
                        icon="pi pi-eye"
                        className="flex-1"
                        outlined
                    />
                    {order.status === 'delivered' && (
                        <Button
                            label="Comprar de nuevo"
                            icon="pi pi-shopping-cart"
                            className="flex-1"
                        />
                    )}
                </div>
            </div>
        );
    };

    return (
        <Card>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Mis Pedidos</h2>
                <span className="text-sm text-gray-600">
                    Cliente ID: {clientID}
                </span>
            </div>

            <DataView
                value={mockOrders}
                itemTemplate={itemTemplate}
                paginator={mockOrders.length > 5}
                rows={5}
                emptyMessage="No tienes pedidos realizados"
            />
        </Card>
    )
};
