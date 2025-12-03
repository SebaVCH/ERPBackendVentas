import { Card } from "primereact/card";
import type { Order } from "../../../types/Order";


type OrderSectionProps = {
    orders : Order
    clientID: number
}

export default function OrderSection({ orders, clientID } : OrderSectionProps) {
    

    
    return (
        <Card>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Mis Pedidos</h2>
            </div>
            { orders}
        </Card>
    )
};
