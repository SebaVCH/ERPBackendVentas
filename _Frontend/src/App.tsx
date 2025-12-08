import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Header from './components/Header'
import Footer from './components/Footer'
import Login from './pages/Login'
import Register from './pages/Register'
import Cart from './pages/Cart'
import UserProfile from './pages/Profile'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import FailurePayment from './pages/Payment/FailrutePayment/FailurePayment'
import SuccessPayment from './pages/Payment/SuccessPayment/SuccessPayment'
import { ProgressSpinner } from 'primereact/progressspinner'
import { useEffect, useState } from 'react'
import { useAccessToken } from './stores/useSessionStore'


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
    const accessToken = useAccessToken()    

    const [loading, setLoading] = useState(true)
    useEffect(() => {
        const id = setTimeout(() => setLoading(false), 200)
        return () => clearTimeout(id)
    }, [])
    
    if (loading) {
        return (
            <div className="min-w-screen min-h-screen flex items-center justify-center">
                <ProgressSpinner />
            </div>
        );
    }

    if (!accessToken) return <Navigate to="/login" replace/>

    return (
        <Outlet />
    )
}

const queryClient = new QueryClient()

export default function App() {

    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    <Route path='/login' element={<Login />} />
                    <Route path='/register' element={<Register />} />

                    <Route element={<MainLayout />}>
                        <Route path='/' element={<Home />} />
                        <Route path='/payment/success' element={<SuccessPayment />} />
                        <Route path='/payment/failure' element={<FailurePayment />} />


                        <Route element={<ProtectedRoute />}>
                            <Route path='/mi-perfil' element={<UserProfile />} />
                            <Route path='/mi-carrito' element={<Cart />}/>
                        </Route>
                    </Route>
        
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    )
}
