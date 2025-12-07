import type { Product } from "../../types/Product"


export type ProductResponse = {
    id_product:number
    nombre:string
    descripcion:string
    precio_unitario:number
    estado:boolean
    cantidad:number
}

export type ProductRequest = Product

export function adapterProductResponse( res : ProductResponse) : Product {
    return {
        productID: res.id_product,
        name: res.nombre,
        description: res.descripcion,
        unitPrice: res.precio_unitario,
        state: res.estado,
        stock: res.cantidad
    }
}

export function adapterProductRequest( req : ProductRequest) : ProductResponse {
    return {
        id_product: req.productID,
        nombre: req.name,
        descripcion: req.description,
        precio_unitario: req.unitPrice,
        estado: req.state,
        cantidad: req.stock
    }
}