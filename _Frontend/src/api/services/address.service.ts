import type { Address } from "../../types/Address";
import { adaptAddressRequest, adaptAddressResponse, type AddressResponse } from "../adapter/address.adapter";
import { axiosInstance } from "./axiosInstance";


const RESOURCE_NAME = 'directions'

export async function updateAddress( uptAddress : Address): Promise<Address> {
    const payload = adaptAddressRequest(uptAddress)
    const { data } = await axiosInstance.put<{data: AddressResponse}>(`/${RESOURCE_NAME}/${uptAddress.id}`, payload)
    return adaptAddressResponse(data.data)
}

export async function createAddress( newAddress : Address): Promise<Address> {
    const payload = adaptAddressRequest(newAddress)
    const { data } = await axiosInstance.post<{data: AddressResponse}>(`/${RESOURCE_NAME}`, payload)
    return adaptAddressResponse(data.data)
}

export async function getAddressByID( addressID : number): Promise<Address> {
    const { data } = await axiosInstance.get<{data: AddressResponse}>(`/${RESOURCE_NAME}/${addressID}`)
    return adaptAddressResponse(data.data)
}

export async function deleteAddress( idAddress : number): Promise<boolean> {
    const { data } = await axiosInstance.delete(`/${RESOURCE_NAME}/${idAddress}`)
    return data?.success
}