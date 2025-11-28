import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Header from './components/Header'
import Footer from './components/Footer'
import Cart from "./pages/Cart.tsx";

export default function App() {
    return (
        <BrowserRouter>
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        {<Route path="/mi-carrito" element={<Cart />} />}
                    </Routes>
                </main>
                <Footer />
            </div>
        </BrowserRouter>
    )
}
