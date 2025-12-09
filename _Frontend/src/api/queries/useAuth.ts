import { useMutation, useQuery } from "@tanstack/react-query";
import useSessionStore, { useAccessToken } from "../../stores/useSessionStore";
import { checkToken, login, register } from "../services/auth.service";
import type { Register } from "../adapter/auth.adapter";
import type { AxiosError } from "axios";



export type ErrorResponse = {
    message : string
}

export type LoginBody = {
    email : string
    password: string
}

export function useLogin() {
    const setAccessToken = useSessionStore(s => s.setAccessToken)
    return useMutation<string, AxiosError<ErrorResponse>, LoginBody>({
        mutationFn: ({ email, password }) => login(email, password),
        onSuccess: (token) => {
            setAccessToken(token)
        },
        onError: (error : AxiosError) => {
            console.log(error)
        }
    })
}

export function useRegister() {
    const setAccessToken = useSessionStore(s => s.setAccessToken)
    return useMutation({
        mutationFn: ( newClient : Register) => register(newClient),
        onSuccess: (token) => {
            setAccessToken(token)
        },
        onError: (error : AxiosError<ErrorResponse>) => {
            console.log(error)
        }
    })
}

export function useCheckToken() {
    const accessToken = useAccessToken()
    return useQuery({
        queryKey: ['check', accessToken],
        queryFn: () => checkToken(accessToken),
        staleTime: 1000 * 60 * 5,
        retry: false,
        refetchOnWindowFocus: false
    })
}
