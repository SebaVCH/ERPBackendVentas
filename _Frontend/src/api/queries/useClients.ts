import { useQuery } from "@tanstack/react-query";
import { getClients } from "../services/client.service";


// queries/ -> para tanstack queries 


export function useClients() {
    return useQuery({
        queryKey: ['clients'],
        queryFn:() => getClients()
    })
} 