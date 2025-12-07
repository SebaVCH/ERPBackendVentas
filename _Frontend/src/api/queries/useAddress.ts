import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Address } from "../../types/Address";
import { createAddress, deleteAddress, getAddressByID, updateAddress } from "../services/address.service";



export function useAddressByID( addressID : number) {
    return useQuery({
        queryKey: ['address', addressID],
        queryFn: () => getAddressByID(addressID),
        enabled: !!addressID
    })
}

export function useUpdateAddress() {
    const queryClients = useQueryClient()

    return useMutation({
        mutationFn: (uptAddress : Address) => updateAddress(uptAddress),
        onSuccess: () => {
            queryClients.invalidateQueries({ queryKey: ['address_client']})
        },
        onError: (err) => {
            console.log(err)
        }
    })
}

export function useCreateAddress() {
    const queryClients = useQueryClient()

    return useMutation({
        mutationFn: (newAddress : Address) => createAddress(newAddress),
        onSuccess: () => {
            queryClients.invalidateQueries({ queryKey: ['address_client']})
        },
        onError: (error) => {
            console.log(error)
        }
    })
}


export function useDeleteAddress() {
    const queryClients = useQueryClient()

    return useMutation({
        mutationFn: ( addressID : number) => deleteAddress(addressID),
        onSuccess: () => {
            queryClients.invalidateQueries({ queryKey: ['address_client']})
        },
        onError: (err) => {
            console.log(err)
        }
    })
}

export function useSubmitAddress() {
    const create = useCreateAddress();
    const update = useUpdateAddress();

    const submit = (address: Address, callbacks?: { onSuccess?: () => void }) => {
        if (address.id && address.id !== 0) {
            update.mutate(address, {
                onSuccess: callbacks?.onSuccess
            });
        } else {
            create.mutate(address, {
                onSuccess: callbacks?.onSuccess
            });
        }
    };

    return { submit, isPending: create.isPending || update.isPending };
}
