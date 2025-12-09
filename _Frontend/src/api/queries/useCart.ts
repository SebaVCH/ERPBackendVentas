import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addCartItem, getCartItems, removeCartItem } from "../services/cart.service";
import type { Cart, CartItem } from "../../types/Cart";
import { AxiosError } from "axios";



export function useAddItemToCart() {
    const queryClients = useQueryClient()
    
    return useMutation({
        mutationFn: (newItem : CartItem) => addCartItem(newItem),
        onSuccess: () => {
            queryClients.invalidateQueries({ queryKey: ['cart'] })
        },
        onError: (e) => {
            console.log(e)
        }
    })
}

export function useCart(clientID : number) {
    return useQuery<Cart, AxiosError>({
        queryKey: ['cart', clientID],
        queryFn: () => getCartItems(clientID),
        enabled: !!clientID,
    })
}


export function useDeleteCartItem() {
    const queryClients = useQueryClient()
    return useMutation({
        mutationFn: (cartItem : CartItem) => removeCartItem(cartItem),
        onSuccess: () => {
            queryClients.invalidateQueries({ queryKey: ['cart'] })
        },
        onError: (e) => {
            console.log(e)
        }
    })
}