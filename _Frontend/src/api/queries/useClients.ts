import { useQuery } from "@tanstack/react-query";
import { getAddressByClient, getClientByID, getClients } from "../services/client.service";


// queries/ -> para tanstack queries 


export function useClients() {
    return useQuery({
        queryKey: ['clients'],
        queryFn:() => getClients()
    })
} 

export function useClient(clientID : number) {
    return useQuery({
        queryKey: ['client', clientID],
        queryFn: () => getClientByID(clientID),
        enabled: !!clientID
    })
}

export function useClientAddress(clientID : number) {
    return useQuery({
        queryKey: ['address_client', clientID],
        queryFn: () => getAddressByClient(clientID),
        enabled: !!clientID
    })
}