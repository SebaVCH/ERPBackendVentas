import { useMutation } from "@tanstack/react-query";
import useSessionStore from "../../stores/useSessionStore";
import { login, register } from "../services/auth.service";
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