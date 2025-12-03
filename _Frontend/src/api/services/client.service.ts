import type { Client } from "../../types/Client";
import { axiosInstance } from "./axiosInstance";



// services/ -> los recursos/elementos que se conectando con el backend



const RESOURCE_NAME = 'clientes' // o clients no me acuerdo xd

// Ejemplo 
export async function getClients(): Promise<Client[]> {
    const { data } = await axiosInstance.get(`${import.meta.env.VITE_URL_VENTAS_BACKEND}/${RESOURCE_NAME}`)
    return data?.data
}