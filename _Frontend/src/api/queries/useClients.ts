import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAddressByClient, getClientByID, getClients } from "../services/client.service";
import { useAccessToken } from "../../stores/useSessionStore";


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
        enabled: !!clientID,
    })
}

export function useClientID() {
    const accessToken = useAccessToken()
    const queryClient = useQueryClient()

    return queryClient.getQueryData<{ clientID: number }>(['check', accessToken])?.clientID
}

export function useClientAddress(clientID : number) {
    return useQuery({
        queryKey: ['address_client', clientID],
        queryFn: () => getAddressByClient(clientID),
        enabled: !!clientID,
    })
}
