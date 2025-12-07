import { OrderItemsList } from "./Components/OrderItemsList";
import { OrderPriceSummary } from "./Components/OrderPriceSummary";
import { OrderSummaryCards } from "./Components/OrderSummaryCards";
import { SuccessHeader } from "./Components/SuccessHeader";
import { LoadingState } from "../../../components/LoadingState";
import { ErrorState } from "../../../components/ErrorState";
import { useOrderDetail } from "../../../api/queries/useOrder";
import { useAddressByID } from "../../../api/queries/useAddress";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import { AdditionalInfo } from "../../../components/AditionalInfo";

export default function SuccessPayment() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const orderIdParam = searchParams.get("order_id")
    const orderId = Number(orderIdParam)
    
    const { data: orderDetail, error: orderError, isLoading: orderLoading, isSuccess: orderSuccess } = useOrderDetail(orderId)
    const addressID = orderDetail?.order.AddressID ?? 0
    
    const { data: address, isLoading: addressLoading } = useAddressByID(addressID)
    const deliveryAddress = address ? `${address.street} ${address.number}` : "Dirección no disponible"
    
    const { subtotal, iva, total } = useMemo(() => {
        if (!orderDetail) 
            return { subtotal: 0, iva: 0, total: 0 }

        const subtotalCalc = orderDetail.orderItems.reduce((sum, item) => sum + item.unitPrice * item.amount, 0)
        return {
            subtotal: subtotalCalc,
            iva: subtotalCalc * 0.19,
            total: subtotalCalc * 1.19
        }
    }, [orderDetail])


    if (!orderIdParam || isNaN(orderId) || orderId <= 0) 
        return <ErrorState title="Orden no válida" message="El enlace de la orden es incorrecto o está incompleto." />
    
    if (orderLoading || addressLoading) 
        return <LoadingState message="Cargando información de tu orden..." />
    
    if (!orderSuccess || orderError) 
        return <ErrorState title="Error al cargar la orden" message="No pudimos obtener la información del pedido. Intenta nuevamente más tarde." />
    
    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 via-gray-200 to-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
                    <SuccessHeader />
                    <OrderSummaryCards
                        orderId={String(orderId)}
                        status="Pagado"
                        date={orderDetail.order.orderDate.toLocaleDateString("es-CL")}
                        deliveryAddress={deliveryAddress}
                    />
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <OrderItemsList items={orderDetail.orderItems} />
                    </div>

                    <div className="lg:col-span-1">
                        <OrderPriceSummary
                            subtotal={subtotal}
                            iva={iva}
                            total={total}
                            onViewOrders={() => navigate('/mi-perfil')}
                            onGoHome={() => navigate('/')}
                        />
                        <AdditionalInfo 
                            title="¿Qué sigue?"
                            message="Te enviaremos un correo con los detalles de tu compra y el seguimiento de tu pedido."
                            icon="pi-info-circle"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
