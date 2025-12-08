import axios from 'axios'


export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_URL_VENTAS_BACKEND,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'applicacion/json'
    }
})

