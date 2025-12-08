import { adapterProductDetailResponse, type ProductDetailResponse } from "../adapter/productDetail.adapter"
import { axiosInstance } from "./axiosInstance"

const RESOURCE_NAME = "products/details"

export async function getProductDetails() {
    const { data } = await axiosInstance.get<{ data: ProductDetailResponse[] }>(RESOURCE_NAME)
    return data.data.map(adapterProductDetailResponse)
}
