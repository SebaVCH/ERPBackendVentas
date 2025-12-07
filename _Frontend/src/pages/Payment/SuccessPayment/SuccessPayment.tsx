import { OrderItemsList } from "./Components/OrderItemsList";
import { OrderPriceSummary } from "./Components/OrderPriceSummary";
import { OrderSummaryCards } from "./Components/OrderSummaryCards";
import { SuccessHeader } from "./Components/SuccessHeader";
import { OrderAdditionalInfo } from "./Components/OrderAdditionalInfo";
import { LoadingState } from "../../../components/LoadingState";
import { ErrorState } from "../../../components/ErrorState";
import { useOrderDetail } from "../../../api/queries/useOrder";


export default function SuccessPayment() {
    const searchParams = new URLSearchParams(window.location.search);
    const orderId = searchParams.get("order_id") || "0";

    const { data: orderDetail, error, isLoading, isSuccess } = useOrderDetail(Number(orderId))
    
    const calculateSubtotal = () => {
        if(!orderDetail) return 0
        return orderDetail.orderItems.reduce((sum, item) => 
            sum + (item.unitPrice * item.amount), 0
        )
    }


    const subtotal = calculateSubtotal();
    const iva = subtotal * 0.19;
    const total = subtotal + iva;


    if (isLoading) {
        return <LoadingState message="Cargando información de tu orden..." />;
    }

    if(!isSuccess) {
        return <ErrorState title="Error al buscar el pedido" message="No pudimos cargar la información del pedido. Por favor intentelo más tarde" />
    }

    if (error || !orderId) {
        return <ErrorState title={"Orden no encontrada"} message={"No pudimos cargar la información de tu orden. Por favor, verifica el enlace."} />;
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 via-gray-200 to-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
                    <SuccessHeader />
                    <OrderSummaryCards orderId={orderId} status={"Pagado"} date={(new Date()).toLocaleDateString('CL')} deliveryAddress={"AV. Aguirre 666"} />
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <OrderItemsList items={orderDetail?.orderItems} />
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