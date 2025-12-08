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

export type TokenContentBackend = {
    cliente_id: number
    email: string
    expires_at: number
    role: string
}

export type TokenContent = {
    clientID: number
    email: string
    expiresAt: number
    role: string
}

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

export function adapterTokenContentResponse( tokenRes : TokenContentBackend): TokenContent {
    return {
        clientID: tokenRes.cliente_id,
        email: tokenRes.email,
        expiresAt: tokenRes.expires_at,
        role: tokenRes.role
    }
}