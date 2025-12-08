import { useMutation, useQuery } from "@tanstack/react-query";
import { addCartItem, getCartItems, removeCartItem } from "../services/cart.service";
import type { Cart, CartItem } from "../../types/Cart";
import { AxiosError } from "axios";



export function useAddItemToCart() {
    return useMutation({
        mutationFn: (newItem : CartItem) => addCartItem(newItem),
    })
}

export function useCart(clientID : number) {
    return useQuery<Cart, AxiosError>({
        queryKey: ['cart', clientID],
        queryFn: () => getCartItems(clientID),
        enabled: !!clientID,
    })
}

export function useRemoveItemCart() {
    return useMutation({
        mutationFn: (cartItem : CartItem) => removeCartItem(cartItem)
    })
}