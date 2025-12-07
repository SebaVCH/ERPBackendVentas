import { Card } from "primereact/card";


interface Producto {
    id_producto: number;
    nombre: string;
    descripcion: string;
    precio_unitario: number;
    estado: boolean;
    cantidad: number;
}

interface VentaProducto {
    id_venta: number;
    id_producto: number;
    producto: Producto;
    cantidad: number;
    precio_unit: number;
}

interface OrderItemsListProps {
    items: VentaProducto[];
}

export function OrderItemsList({ items }: OrderItemsListProps) {
    return (
        <Card className="shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Detalles de tu compra
            </h2>

            <div className="space-y-4">
                {items.map((item) => (
                    <OrderItemCard key={`${item.id_venta}-${item.id_producto}`} item={item} />
                ))}
            </div>
        </Card>
    );
}

// Sub-componente
function OrderItemCard({ item }: { item: VentaProducto }) {
    return (
        <div className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                <i className="pi pi-box text-gray-400 text-2xl"></i>
            </div>

            <div className="flex-1">
                <h3 className="font-semibold text-gray-800 mb-1">
                    {item.producto.nombre}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                    {item.producto.descripcion}
                </p>
                <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-600">
                        Cantidad: <strong>{item.cantidad}</strong>
                    </span>
                    <span className="text-gray-600">
                        Precio unit: <strong>${item.precio_unit.toLocaleString('es-CL')}</strong>
                    </span>
                </div>
            </div>

            <div className="text-right flex-shrink-0">
                <p className="text-lg font-bold text-blue-600">
                    ${(item.precio_unit * item.cantidad).toLocaleString('es-CL')}
                </p>
            </div>
        </div>
    );
}