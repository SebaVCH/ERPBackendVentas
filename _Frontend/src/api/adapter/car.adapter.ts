import type { CartItem, Cart } from "../../types/Cart"
import { adapterProductRequest, adapterProductResponse, type ProductResponse } from "./product.adapter"

export type CartItemBackend = {
    id_cliente: number
    id_producto: number
    cantidad: number
    precio_venta: number
    producto: ProductResponse
}

export type CartItemRequest = CartItem
export type CartRequest = Cart

export function adaptCartItemRequest( req : CartItemRequest): CartItemBackend {
    return {
        id_cliente: req.clientID,
        id_producto: req.productID,
        cantidad: req.amount,
        precio_venta: req.unitPrice,
        producto: adapterProductRequest(req.product)
    }
}

export function adaptCartItemResponse( req : CartItemBackend): CartItem {
    return {
        clientID: req.id_cliente,
        productID: req.id_producto,
        amount: req.cantidad,
        unitPrice: req.precio_venta,
        product: adapterProductResponse(req.producto)
    }
}

export type CartBackend = {
    cart: {
        id_cart: number
        id_cliente: number
        fecha_creacion: string
        estado: boolean
    }
    cart_products: CartItemBackend[]
}

export function adaptCartResponse( res : CartBackend): Cart {
    return {
        cartID: res.cart.id_cart,
        clientID: res.cart.id_cliente,
        createdAt: new Date(res.cart.fecha_creacion),
        state: res.cart.estado,
        cartProducts: res.cart_products.map((cartItem) => adaptCartItemResponse(cartItem))
    }
}