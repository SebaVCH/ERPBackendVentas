import type { CheckoutResponse, CreateCheckoutRequest } from "../../types/Payment"


export type CreateCheckoutBackend = {
    id_cliente: number
    id_direccion: number
    amount: number
    title: string
}

export type CheckoutResponseBackend = {
    init_point: string
    preference_id: string
}


export function adaptCheckoutResponse( res : CheckoutResponseBackend ) : CheckoutResponse {
    return {
        initPoint: res.init_point,
        preferenceId: res.preference_id
    }
}

export function adaptCheckoutRequest( req : CreateCheckoutRequest ) : CreateCheckoutBackend {
    return {
        id_cliente: req.clientID,
        id_direccion: req.addressID,
        amount: req.amount,
        title: req.title
    }
}