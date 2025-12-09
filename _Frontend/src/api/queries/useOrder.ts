import { useQuery } from "@tanstack/react-query";
import { getOrderDetail, getOrdersByClientID } from "../services/order.service";




export function useOrderDetail( orderID : number) {
    return useQuery({
        queryKey: ['orders', orderID],
        queryFn:() => getOrderDetail(orderID),
        enabled: !!orderID
    })
} 

export function useOrderByClientID( clientID : number) {
    return useQuery({
        queryKey: ['orders_client', clientID],
        queryFn: () => getOrdersByClientID(clientID),
        enabled: !!clientID
    })
}