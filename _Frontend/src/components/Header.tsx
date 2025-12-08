import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { InputText } from 'primereact/inputtext'
import { useCheckToken } from '../api/queries/useAuth'
import 'primeicons/primeicons.css'
import logo from '../assets/logo.png'

export default function Header() {
    const navigate = useNavigate()
    const { search } = useLocation()
    const [term, setTerm] = useState('')
    const { data: checkToken } = useCheckToken()
    const isLoggedIn = !!checkToken?.clientID

    // Si venimos de /products con ?search=..., muestra el término en el input
    useEffect(() => {
        const params = new URLSearchParams(search)
        const q = params.get('search') || ''
        setTerm(q)
    }, [search])

    const handleSubmit = (evt?: React.FormEvent) => {
        evt?.preventDefault()
        const q = term.trim()
        navigate(q ? `/products?search=${encodeURIComponent(q)}` : '/products')
    }

    const handleKeyDown = (evt: React.KeyboardEvent<HTMLInputElement>) => {
        if (evt.key === 'Enter') {
            handleSubmit()
        }
    }

    return (
        <header className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 shadow-lg border-b border-white/10 text-white">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center gap-6">
                    <div className="flex-shrink-0">
                        <h1 className="whitespace-nowrap">
                            <Link to="/">
                                <img
                                    src={logo}
                                    alt="Logo"
                                    className="h-20 w-auto drop-shadow"
                                />
                            </Link>
                        </h1>
                    </div>

                    <form className="flex-grow max-w-2xl mx-auto" onSubmit={handleSubmit}>
                        <div className="p-inputgroup">
                            <span className="p-inputgroup-addon">
                                <i className="pi pi-search"></i>
                            </span>
                            <InputText
                                placeholder="Buscar productos..."
                                className="w-full bg-white text-gray-900"
                                value={term}
                                onChange={(e) => setTerm(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                            <button
                                type="submit"
                                className="px-4 bg-black/30 hover:bg-black/40 text-white font-semibold text-sm border border-white/30"
                            >
                                Buscar
                            </button>
                        </div>
                    </form>

                    <div className="flex items-center gap-3 flex-shrink-0">
                        <button onClick={() => navigate('/mi-carrito')} className="relative flex items-center gap-2 px-3 py-2 bg-black/25 hover:bg-black/35 text-white border border-white/20 rounded-md shadow">
                            <i className="pi pi-shopping-cart"></i>
                            <span className="text-sm font-semibold">Carrito</span>
                            <span className="absolute -top-2 -right-2 bg-cyan-400 text-black text-xs font-bold px-2 py-1 rounded-full border border-black/10">
                                69
                            </span>
                        </button>
                        {!isLoggedIn ? (
                            <button onClick={() => navigate('/register')} className="flex items-center gap-2 px-3 py-2 bg-cyan-400 text-black hover:bg-cyan-300 border border-cyan-500 rounded-md shadow font-semibold">
                                <i className="pi pi-user-plus"></i>
                                <span className="text-sm">Registrarse</span>
                            </button>
                        ) : (
                            <button onClick={() => navigate('/mi-perfil')} className="flex items-center gap-2 px-3 py-2 bg-white text-indigo-700 hover:bg-indigo-50 border border-white/60 rounded-md shadow">
                                <i className="pi pi-user"></i>
                                <span className="text-sm font-semibold">Mi cuenta</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}

