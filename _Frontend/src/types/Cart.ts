import type { Product } from "./Product"

export type Cart = {
    cartID: number
    clientID: number
    createdAt: Date
    state: boolean
    cartProducts: CartItem[]
}

export type CartItem = {
    clientID: number 
    productID: number
    amount: number
    unitPrice: number
    product: Product
}