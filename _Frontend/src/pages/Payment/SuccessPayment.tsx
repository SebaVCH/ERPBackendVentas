import { useSearchParams } from "react-router-dom";


export default function SuccessPayment() {
    
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get("order_id");
    

    return (
        <div>
            <h1>Compra Realizada con éxito: order_id: {orderId}</h1>
        </div>
    )
};
