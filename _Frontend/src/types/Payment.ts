

export type CreateCheckoutRequest = {
    clientID:   number
    addressID:  number 
    amount:     number 
    title:      string
}

export type CheckoutResponse = {
    initPoint:     string
    preferenceId:  string
}