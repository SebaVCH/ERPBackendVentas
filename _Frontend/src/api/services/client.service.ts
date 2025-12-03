import type { Address } from "../../types/Address";
import type { Client } from "../../types/Client";
import { adaptAddressResponse, type AddressResponse } from "../adapter/address.adapter";
import { adaptUserResponse, type ClientResponse } from "../adapter/client.adapter";
import { axiosInstance } from "./axiosInstance";



// services/ -> los recursos/elementos que se conectando con el backend



const RESOURCE_NAME = 'clientes'
const RESOURCE_DIRECTION_NAME = 'directions'


// Ejemplo 
export async function getClients(): Promise<Client[]> {
    const { data } = await axiosInstance.get(`/${RESOURCE_NAME}`)
    const res = (data?.data as ClientResponse[]).map((c) => adaptUserResponse(c))
    return res
}


export async function getClientByID( clientID : number ): Promise<Client> {
    const { data } = await axiosInstance.get(`/${RESOURCE_NAME}/${clientID}`)
    return adaptUserResponse(data?.data as ClientResponse)
}

export async function getAddressByClient(id : number) : Promise<Address[]> {
    const { data } = await axiosInstance.get(`/${RESOURCE_NAME}/${id}/${RESOURCE_DIRECTION_NAME}`)
    console.log(data)
    const res = (data?.data as AddressResponse[]).map((a) => adaptAddressResponse(a))
    return res
}