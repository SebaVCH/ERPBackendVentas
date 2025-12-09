import type { Order, OrderProduct } from "../../types/Order"
import { adapterProductResponse, type ProductResponse } from "./product.adapter"



export type OrderResponse = {
    id_venta: number
    id_cliente: number
    id_carrito: number
    id_direccion: number
    fecha_pedido: string
    total: number
    estado: string
    forma_de_pago: string
    condiciones_de_pago: string
}



export type OrderRequest = Order

export function adapterOrderResponse(res: OrderResponse): Order {
    return {
        id: res.id_venta,
        clientID: res.id_cliente,
        cartID: res.id_carrito,
        AddressID: res.id_direccion,
        orderDate: new Date(res.fecha_pedido),
        total: res.total,
        state: res.estado,
        paymentMethod: res.forma_de_pago,
        termsOfPayment: res.condiciones_de_pago
    }
}

export function adapterOrderRequest(req: OrderRequest): OrderResponse {
    return {
        id_venta: req.id,
        id_cliente: req.clientID,
        id_carrito: req.cartID,
        id_direccion: req.AddressID,
        fecha_pedido: req.orderDate.toISOString(),
        total: req.total,
        estado: req.state,
        forma_de_pago: req.paymentMethod,
        condiciones_de_pago: req.termsOfPayment
    }
}

export type OrderDetailResponse = {
    id_venta: number
    id_producto: number
    producto: ProductResponse
    cantidad: number
    precio_venta: number
}

export function adapterOrderDetailResponse(res: OrderDetailResponse): OrderProduct {
    return {
        product: adapterProductResponse(res.producto), 
        amount: res.cantidad,
        unitPrice: res.precio_venta
    }
}
