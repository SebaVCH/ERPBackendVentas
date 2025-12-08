import { useQuery } from "@tanstack/react-query"
import { getProductDetails } from "../services/productDetail.service"

export function useProductDetails() {
    return useQuery({
        queryKey: ['productDetails'],
        queryFn: getProductDetails,
        staleTime: 1000 * 60 * 5, // 5 minutos
    })
}
