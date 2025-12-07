import { useQuery } from "@tanstack/react-query";
import { getOrderDetail } from "../services/order.service";




export function useOrderDetail( orderID : number) {
    return useQuery({
        queryKey: ['orders', orderID],
        queryFn:() => getOrderDetail(orderID),
        enabled: !!orderID
    })
} 