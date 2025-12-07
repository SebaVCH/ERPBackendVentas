import { InfoCard } from "../../../../components/InfoCard";

interface OrderSummaryCardsProps {
    orderId: string
    status: string
    date: string
    deliveryAddress: string
}

export function OrderSummaryCards({ orderId, status, date, deliveryAddress } : OrderSummaryCardsProps) {
    return (
        <div className="p-8">
            <div className="grid md:grid-cols-4 gap-6">
                <InfoCard 
                    icon="pi pi-shopping-bag" 
                    label="Número de orden" 
                    value={`#${orderId}`} 
                />
                <InfoCard 
                    icon="pi pi-check" 
                    label="Estado" 
                    value={status} 
                    iconColor="text-green-600" 
                    iconBgColor="bg-green-100" 
                    valueColor="text-green-600"
                />
                <InfoCard 
                    icon="pi pi-calendar" 
                    label="Fecha Creación" 
                    value={date} 
                    iconColor="text-purple-600" 
                    iconBgColor="bg-purple-100"
                />
                <InfoCard 
                    icon="pi pi-send" 
                    label="Entrega" 
                    value={deliveryAddress} 
                    iconColor="text-gray-600" 
                    iconBgColor="bg-gray-100"
                />
            </div>
        </div>
    );
}