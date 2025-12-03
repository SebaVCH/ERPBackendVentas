import { Card } from "primereact/card";


export type OrderSectionProps = {
    clientID: number
}

export default function OrderSection({ clientID } : OrderSectionProps) {
    

    
    return (
        <Card>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Mis Pedidos</h2>
            </div>
            <h1>
                Cliente ID: {clientID}
            </h1>
        </Card>
    )
};
