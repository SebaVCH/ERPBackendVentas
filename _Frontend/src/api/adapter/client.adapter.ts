import type { Client } from "../../types/Client"


export type ClientResponse = {
    id_cliente: number
    nombre:     string
    apellido:   string
    direccion:  string
    telefono:   string
    email:      string
    estado:     string
    created_at: string
} 

export type ClientUpdate = Partial<Client>

export type ClientRequest = Client


export function adaptUserResponse( res : ClientResponse ) : Client {
    return {    
        id: res.id_cliente,
        firstName: res.nombre,
        lastName: res.apellido,
        email: res.email,
        phone: res.telefono,
        state: res.estado,
        address: res.direccion,
        createdAt: new Date(res.created_at)
    }
}

export function adaptUserRequest( req : Partial<ClientRequest> ) : Partial<ClientResponse> {
    return {
        id_cliente: req.id,
        nombre: req.firstName,
        apellido: req.lastName,
        email: req.email,
        telefono: req.phone,
        estado: req.state,
        direccion: req.address,
    }
}