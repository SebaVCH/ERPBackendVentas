import type { CheckoutResponse, CreateCheckoutRequest } from "../../types/Payment";
import { adaptCheckoutRequest, adaptCheckoutResponse } from "../adapter/payment.adapter";
import { axiosInstance } from "./axiosInstance";


const RESOURCE_NAME = 'payments'


export async function createCheckout(checkout : CreateCheckoutRequest) : Promise<CheckoutResponse> {
    const payload = adaptCheckoutRequest(checkout)
    const { data } = await axiosInstance.post(`/${RESOURCE_NAME}/checkout`, payload)
    return adaptCheckoutResponse(data?.data)
}

