import type { Cart, CartItem } from "../../types/Cart"
import { adaptCartResponse, adaptCartItemRequest } from "../adapter/car.adapter"
import { axiosInstance } from "./axiosInstance"


const RESOURCE_NAME = 'cart'



export async function getCartItems( clientID : number): Promise<Cart> {
    const { data } = await axiosInstance.get(`${RESOURCE_NAME}/item/${clientID}`)
    return adaptCartResponse(data.data)
}

export async function addCartItem( newItem : CartItem ) {
    const payload = adaptCartItemRequest(newItem)
    const { data } = await axiosInstance.post(`${RESOURCE_NAME}/item`, payload)
    return data?.data
} 

export async function removeCartItem( item : CartItem) {
    const payload = adaptCartItemRequest(item)
    const { data } = await axiosInstance.put(`${RESOURCE_NAME}/item`, payload)
    return data.data
}

