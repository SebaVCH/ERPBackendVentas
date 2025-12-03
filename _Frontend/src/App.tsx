import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Header from './components/Header'
import Footer from './components/Footer'
import Login from './pages/Login'
import Register from './pages/Register'
import Cart from './pages/Cart'
import UserProfile from './pages/Profile'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

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
                        <Route path='/mi-carrito' element={<Cart />} />
                        <Route path='/mi-perfil' element={<UserProfile />} />
                    </Route>
        
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    )
}
