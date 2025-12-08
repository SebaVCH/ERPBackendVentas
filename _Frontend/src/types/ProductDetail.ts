import type { Product } from "./Product"

export type ProductDetail = {
    extraDetailID: number
    productID: number
    product: Product
    category: string
    imageUrl: string
}
