import type { Address } from "../../types/Address"


export type AddressResponse = {
    id_direccion: number
    id_cliente: number
    direccion: string
    numero: string
    ciudad: string
    region: string
    comuna: string
    codigo_postal: string
    etiqueta: string
    default: boolean
}

export type AddressRequest = Address


export function adaptAddressResponse( res : AddressResponse ) : Address {
    return {
        id: res.id_direccion,
        clientID: res.id_cliente,
        street: res.direccion,
        number: res.numero,
        city: res.ciudad,
        region: res.region,
        commune: res.comuna,
        postalCode: res.codigo_postal,
        label: res.etiqueta,
        isDefault: res.default
    }
}

export function adaptAddressRequest( req : AddressRequest ) : AddressResponse {
    return {
        id_cliente: req.clientID,
        id_direccion: req.id,
        direccion: req.street,
        numero: req.number,
        ciudad: req.city,
        comuna: req.commune,
        codigo_postal: req.postalCode,
        etiqueta: req.label,
        region: req.region,
        default: req.isDefault
    }
}