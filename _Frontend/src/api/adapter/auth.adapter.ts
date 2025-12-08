import type { Client } from "../../types/Client"

export type RegisterBackendRequest = {
    cliente_id?: number
    nombre: string
    apellido: string
    email: string
    password: string
}

export type LoginBackendRequest = {
    email: string
    password: string
}

export type Register = Omit<Client, 'id' | 'phone' | 'state' | 'address'> & { password : string }

export function adaptRegisterRequest( req : Register, ): RegisterBackendRequest {
    return  {
        nombre: req.firstName,
        apellido: req.lastName,
        email: req.email,
        password: req.password
    }
}

export function adaptLoginRequest( email : string, password: string) : LoginBackendRequest{
    return {
        email: email,
        password: password
    }
}