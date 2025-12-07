import { useState, useEffect } from "react";
import { OrderItemsList } from "./Components/OrderItemsList";
import { OrderPriceSummary } from "./Components/OrderPriceSummary";
import { OrderSummaryCards } from "./Components/OrderSummaryCards";
import { SuccessHeader } from "./Components/SuccessHeader";
import { OrderAdditionalInfo } from "./Components/OrderAdditionalInfo";
import { LoadingState } from "../../../components/LoadingState";
import { ErrorState } from "../../../components/ErrorState";

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

async function getOrderByID(orderId: string): Promise<VentaProducto[]> {
    // Simular delay de API
    console.log(orderId)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return [
        {
            "id_venta": 1,
            "id_producto": 1,
            "producto": {
                "id_producto": 1,
                "nombre": "Laptop Dell Inspiron 14",
                "descripcion": "Notebook 14\" Intel i5, 16GB RAM, SSD 512GB",
                "precio_unitario": 520000,
                "estado": true,
                "cantidad": 6
            },
            "cantidad": 5,
            "precio_unit": 520000
        },
        {
            "id_venta": 1,
            "id_producto": 3,
            "producto": {
                "id_producto": 3,
                "nombre": "Teclado Mecánico Redragon Kumara K552",
                "descripcion": "Teclado mecánico con retroiluminación RGB",
                "precio_unitario": 28000,
                "estado": true,
                "cantidad": 2
            },
            "cantidad": 4,
            "precio_unit": 28000
        }
    ];
}

export default function SuccessPayment() {
    const searchParams = new URLSearchParams(window.location.search);
    const orderId = searchParams.get("order_id") || "12345";
    
    const [orderItems, setOrderItems] = useState<VentaProducto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderId) {
                setError(true);
                setLoading(false);
                return;
            }

            try {
                const data = await getOrderByID(orderId);
                setOrderItems(data);
            } catch (err) {
                console.error('Error al obtener la orden:', err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId]);

    const calculateSubtotal = () => {
        return orderItems.reduce((sum, item) => 
            sum + (item.precio_unit * item.cantidad), 0
        );
    };

    const subtotal = calculateSubtotal();
    const iva = subtotal * 0.19;
    const total = subtotal + iva;

    if (loading) {
        return <LoadingState message="Cargando información de tu orden..." />;
    }

    if (error || !orderId) {
        return <ErrorState title={"Orden no encontrada"} message={"No pudimos cargar la información de tu orden. Por favor, verifica el enlace."} />;
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 via-gray-200 to-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
                    <SuccessHeader />
                    <OrderSummaryCards orderId={orderId} status={"Pagado"} date={(new Date()).toLocaleDateString('CL')} deliveryAddress={"AV. Aguirre 666"} />
                </div>

                {/* Content */}
                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <OrderItemsList items={orderItems} />
                    </div>

                    <div className="lg:col-span-1">
                        <OrderPriceSummary
                            subtotal={subtotal}
                            iva={iva}
                            total={total}
                            onDownloadInvoice={() => console.log('Download invoice')}
                            onViewOrders={() => window.location.href = '/orders'}
                            onGoHome={() => window.location.href = '/'}
                        />
                        <OrderAdditionalInfo />
                    </div>
                </div>
            </div>
        </div>
    );
}