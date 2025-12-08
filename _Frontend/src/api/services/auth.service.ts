import { adaptLoginRequest, adaptRegisterRequest, type Register } from "../adapter/auth.adapter"
import { axiosInstance } from "./axiosInstance"


const RESOURCE_NAME = "auth"


export async function register( newClient : Register) : Promise<string> {
    const payload = adaptRegisterRequest(newClient)
    const { data } = await axiosInstance.post<{data: string}>(`${RESOURCE_NAME}/register`, payload)
    return data.data
}


export async function login( email : string, password : string) : Promise<string> {
    const payload = adaptLoginRequest(email, password)
    const { data } = await axiosInstance.post<{data: string}>(`${RESOURCE_NAME}/login`, payload)
    return data.data
} 
