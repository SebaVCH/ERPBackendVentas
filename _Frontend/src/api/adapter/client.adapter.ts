import type { Client } from "../../types/Client"


export type ClientResponse = {
    id_cliente: number
    nombre:     string
    apellido:   string
    direccion:  string
    telefono:   string
    email:      string
    estado:     string
} 

export type ClientRequest = Client


export function adaptUserResponse( res : ClientResponse ) : Client {
    return {    
        id: res.id_cliente,
        firstName: res.nombre,
        lastName: res.apellido,
        email: res.email,
        phone: res.telefono,
        state: res.estado,
        address: res.direccion
    }
}

export function adaptUserRequest( req : ClientRequest ) : ClientResponse {
    return {
        id_cliente: req.id,
        nombre: req.firstName,
        apellido: req.lastName,
        email: req.email,
        telefono: req.phone,
        estado: req.state,
        direccion: req.address
    }
}