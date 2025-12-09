import { Card } from "primereact/card";
import { DataView } from "primereact/dataview";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { useOrderByClientID } from "../../../api/queries/useOrder";
import { LoadingState } from "../../../components/LoadingState";
import { ErrorState } from "../../../components/ErrorState";
import type { OrderDetail } from "../../../types/Order";
import { useState } from "react";
import OrderDetailDialog from "../components/OrderDetailDialog";

export type OrderSectionProps = {
    clientID: number;
};

export default function OrderSection({ clientID }: OrderSectionProps) {
    const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null)
    const [dialogOpen, setDialogOpen] = useState(false)

    const { data: orders, isLoading, isError, refetch } = useOrderByClientID(clientID);

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "delivered":
                return "Entregado";
            case "pending":
                return "Pendiente";
            case "cancelled":
                return "Cancelado";
            default:
                return status;
        }
    };

    const getStatusSeverity = (status: string) => {
        switch (status) {
            case "delivered":
                return "success";
            case "pending":
                return "warning";
            case "cancelled":
                return "danger";
            default:
                return undefined;
        }
    };

    if (isLoading) return <LoadingState message="Cargando pedidos..." />

    if (isError)
        return (
        <ErrorState
            title="Error al cargar tus pedidos"
            message="No pudimos obtener la información. Intenta nuevamente."
            showRetry
            onRetry={() => refetch()}
        />
    )

    const itemTemplate = (detail: OrderDetail) => {
        const order = detail.order;
        const items = detail.orderItems ?? [];

        return (
            <div className="border-b border-gray-200 pb-6 mb-6 last:border-b-0 last:pb-0 last:mb-0">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Pedido #{order.id}
                            </h3>
                            <Tag
                                value={getStatusLabel(order.state)}
                                severity={getStatusSeverity(order.state)}
                            />
                        </div>

                        <p className="text-sm text-gray-600">
                            Fecha:{" "}
                            {new Date(order.orderDate).toLocaleDateString("es-ES", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </p>
                    </div>

                    <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">
                            ${order.total.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600">{items.length} productos</p>
                    </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">
                        Productos:
                    </h4>

                    <div className="space-y-2">
                        {items.map((item, index) => (
                            <div
                                key={index}
                                className="flex justify-between items-center text-sm"
                            >
                                <span className="text-gray-800">
                                    {item.amount}x {item.product.name}
                                </span>
                                <span className="font-semibold text-gray-900">
                                    ${item.unitPrice.toFixed(2)}
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
                        onClick={() => {
                            setSelectedOrder(detail);
                            setDialogOpen(true);
                        }}
                    />

                    {order.state === "delivered" && (
                        <Button
                            label="Comprar de nuevo"
                            icon="pi pi-shopping-cart"
                            className="flex-1"
                        />
                    )}
                </div>
                <OrderDetailDialog
                    order={selectedOrder}
                    isOpen={dialogOpen}
                    onClose={() => setDialogOpen(false)}
                />
            </div>
        );
    };

    return (
        <Card>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Mis Pedidos</h2>
            </div>

            <DataView
                value={orders ?? []}
                itemTemplate={itemTemplate}
                paginator={orders && orders.length > 5}
                rows={5}
                emptyMessage="No tienes pedidos realizados"
            />
        </Card>
    );
}
