import type { Product } from "../../types/Product"


export type ProductResponse = {
    id_producto: number
    nombre: string
    descripcion: string
    precio_venta: number
    estado: boolean
    cantidad: number
}

export type ProductRequest = Product

export function adapterProductResponse( res : ProductResponse) : Product {
    return {
        productID: res.id_producto,
        name: res.nombre,
        description: res.descripcion,
        unitPrice: res.precio_venta,
        state: res.estado,
        stock: res.cantidad
    }
}

export function adapterProductRequest( req : ProductRequest) : ProductResponse {
    return {
        id_producto: req.productID,
        nombre: req.name,
        descripcion: req.description,
        precio_venta: req.unitPrice,
        estado: req.state,
        cantidad: req.stock
    }
}