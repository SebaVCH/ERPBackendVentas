import { BrowserRouter, Outlet, Route, Routes, useNavigate } from 'react-router-dom'
import './App.css'
import Home from './pages/Home/Home'
import Header from './components/Header'
import Footer from './components/Footer'
import Login from './pages/Login'
import Register from './pages/Register'
import Cart from './pages/Cart'
import UserProfile from './pages/Profile'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import FailurePayment from './pages/Payment/FailrutePayment/FailurePayment'
import SuccessPayment from './pages/Payment/SuccessPayment/SuccessPayment'
import { useCheckToken } from './api/queries/useAuth'
import { useEffect, useState } from 'react'
import useSessionStore from './stores/useSessionStore'
import { ErrorState } from './components/ErrorState'
import { LoadingState } from './components/LoadingState'
import Products from './pages/Products'


const MainLayout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
                <Outlet /> 
            </main>
            <Footer />
        </div>
    )
}


function ProtectedRoute() {
    const navigate = useNavigate()
    const { clearSession } = useSessionStore()
    const { isLoading, isError, error } = useCheckToken()

    const [seconds, setSeconds] = useState(5)
    useEffect(() => {
        if (seconds <= 0) return

        const timer = setInterval(() => {
            setSeconds((prev) => prev - 1)
        }, 1000);

        return () => clearInterval(timer)
    }, [seconds])

    useEffect(() => {
        if (isError) {
            clearSession()
            const timer = setTimeout(() => {
                navigate("/login", { replace: true })
            }, 5000)
            return () => clearTimeout(timer)
        }
    }, [isError, error, clearSession, navigate])


    if (isLoading) {
        return (
            <LoadingState message={''} />
        )
    }

    if (isError) {
        return (
            <ErrorState title={'Sesión expirada'} message={'Serás redirigido automáticamente al login en ' + seconds} />
        )
    }

    return <Outlet />
}



const queryClient = new QueryClient()

export default function App() {

    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    <Route path='/login' element={<Login />} />
                    <Route path='/register' element={<Register />} />

                    <Route path='/' element={<MainLayout />}>
                        <Route index element={<Home />} />
                        <Route path='products' element={<Products />} />

                        <Route element={<ProtectedRoute />}>
                            <Route path='mi-perfil' element={<UserProfile />} />
                            <Route path='mi-carrito' element={<Cart />}/>
                            <Route path='payment/success' element={<SuccessPayment />} />
                            <Route path='payment/failure' element={<FailurePayment />} />
                        </Route>
                    </Route>
        
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    )
}
