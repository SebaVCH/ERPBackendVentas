import { adapterProductResponse, type ProductResponse } from "../adapter/product.adapter"
import { axiosInstance } from "./axiosInstance"

const RESOURCE_NAME = "products"

export async function getProducts() {
    const { data } = await axiosInstance.get<{ data: ProductResponse[] }>(RESOURCE_NAME)
    return data.data.map(adapterProductResponse)
}
