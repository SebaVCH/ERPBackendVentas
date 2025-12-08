import type { ProductDetail } from "../../types/ProductDetail"
import { adapterProductResponse, type ProductResponse } from "./product.adapter"

export type ProductDetailResponse = {
    id_detalle_extra: number
    id_producto: number
    producto: ProductResponse
    categoria: string
    imagen_url: string
}

export type ProductDetailRequest = ProductDetail

export function adapterProductDetailResponse(res: ProductDetailResponse): ProductDetail {
    return {
        extraDetailID: res.id_detalle_extra,
        productID: res.id_producto,
        product: adapterProductResponse(res.producto),
        category: res.categoria,
        imageUrl: res.imagen_url
    }
}

export function adapterProductDetailRequest(req: ProductDetailRequest): ProductDetailResponse {
    return {
        id_detalle_extra: req.extraDetailID,
        id_producto: req.productID,
        producto: {
            id_producto: req.product.productID,
            nombre: req.product.name,
            descripcion: req.product.description,
            precio_venta: req.product.unitPrice,
            estado: req.product.state,
            cantidad: req.product.stock
        },
        categoria: req.category,
        imagen_url: req.imageUrl
    }
}
