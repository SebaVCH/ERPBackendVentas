import type { Address } from "../../types/Address";
import { adaptAddressRequest, adaptAddressResponse, type AddressResponse } from "../adapter/address.adapter";
import { axiosInstance } from "./axiosInstance";


const RESOURCE_NAME = 'directions'

export async function updateAddress( uptAddress : Address): Promise<Address> {
    console.log(uptAddress)
    const payload = adaptAddressRequest(uptAddress)
    const { data } = await axiosInstance.put(`/${RESOURCE_NAME}/${uptAddress.id}`, payload)
    return adaptAddressResponse(data?.data as AddressResponse)
}

export async function createAddress( newAddress : Address): Promise<Address> {
    const payload = adaptAddressRequest(newAddress)
    const { data } = await axiosInstance.post(`/${RESOURCE_NAME}`, payload)
    return adaptAddressResponse(data?.data as AddressResponse)
}



export async function deleteAddress( idAddress : number): Promise<boolean> {
    const { data } = await axiosInstance.delete(`/${RESOURCE_NAME}/${idAddress}`)
    return data?.success
}