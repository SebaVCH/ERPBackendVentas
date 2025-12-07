import type { Product } from "./Product"


export type Order = {
    id: number 
    clientID: number
    cartID: number 
    AddressID: number
    orderDate: string
    total: number
    state: string
    paymentMethod: string
    termsOfPayment: string
}


export type OrderProduct = {
    product : Product 
    amount : number
    unitPrice : number
}

export type OrderDetail = {
    order : Order
    orderItems : OrderProduct[]
}