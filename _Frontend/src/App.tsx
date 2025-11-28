import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Header from './components/Header'
import Footer from './components/Footer'
import Login from './pages/Login'
import Register from './pages/Register'
import Cart from './pages/Cart'


const MainLayout = ({ children } : { children : React.ReactNode}) => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
        </div>
    )
}


export default function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='/' element={
                    <MainLayout>
                        <Home />
                    </MainLayout>
                }/>
                <Route path="/mi-carrito" element={<MainLayout><Cart /></MainLayout>}/>
            </Routes>
        </BrowserRouter>
    )
}
