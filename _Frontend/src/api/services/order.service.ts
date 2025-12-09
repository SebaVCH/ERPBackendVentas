import type { Order, OrderDetail } from "../../types/Order";
import { adapterOrderDetailResponse, adapterOrderResponse, type OrderDetailResponse } from "../adapter/order.adapter";
import { axiosInstance } from "./axiosInstance";


const RESOURCE_NAME = "sales"


export async function getOrder( orderID : number) : Promise<Order> {
    const { data } = await axiosInstance.get(`${RESOURCE_NAME}/${orderID}`)
    return adapterOrderResponse(data?.data)
}

export async function getOrderDetail(orderID: number): Promise<OrderDetail> {
    const [detailsRes, order] = await Promise.all([
        axiosInstance.get<{ data: OrderDetailResponse[] }>(`${RESOURCE_NAME}/${orderID}/details`),
        getOrder(orderID)
    ])

    console.log(detailsRes)

    if (!Array.isArray(detailsRes.data.data)) return { order, orderItems: [] }
    
    return {
        order,
        orderItems: detailsRes.data.data.map(adapterOrderDetailResponse)
    }
}
