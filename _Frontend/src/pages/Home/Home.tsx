import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useProducts } from '../../api/queries/useProducts'
import { useProductDetails } from '../../api/queries/useProductDetails'
import LoginRequiredDialog from './components/LoginRequiredDialog'
import { pickRandom } from '../../utils/pickrandom'
import { ProductCard } from './components/ProductCard'
import { useCheckToken } from '../../api/queries/useAuth'
import { useAddItemToCart, useCart } from '../../api/queries/useCart'
import type { Product } from '../../types/Product'





export default function Home() {
    
    const navigate = useNavigate()
    const { data: checkToken } = useCheckToken()
    const clientID = checkToken?.clientID as number
    const { data: products = [], isLoading: loading, error } = useProducts()
    const { data: productDetails = [] } = useProductDetails()
    const { data: cart } = useCart(clientID)
    const { mutate: mutateAddItemCart } = useAddItemToCart()
    const [ showLoginRequired, setShowLoginRequired ] = useState(false) 

    const productsInCarts = cart?.cartProducts

    const isProductInCart = (productID: number) => {
        return productsInCarts?.some((item) => item.productID === productID) || false
    }

    // Combinar products con sus detalles (imagen y categoría)
    const productsWithDetails = useMemo(() => {
        return products.map(product => {
            const detail = productDetails.find(d => d.productID === product.productID)
            return {
                ...product,
                imageUrl: detail?.imageUrl,
                category: detail?.category
            }
        })
    }, [products, productDetails])

    const featuredUnder100 = useMemo(() => {
        const under100k = productsWithDetails.filter((p) => p.unitPrice < 100000)
        return pickRandom(under100k, 4)
    }, [productsWithDetails])

    const featuredBetween100And200 = useMemo(() => {
        const between = productsWithDetails.filter((p) => p.unitPrice >= 100000 && p.unitPrice < 200000)
        return pickRandom(between, 4)
    }, [productsWithDetails])


    const handleAgregarProductoCarrito = (product : Product) => {
        if(!clientID) {
            setShowLoginRequired(true)
            return
        }
        if(isProductInCart(product.productID)) {
            navigate('/mi-carrito')
            return
        }
        console.log("AAAA")
        mutateAddItemCart({
            clientID: clientID,
            productID: product.productID,
            amount: 1,
            unitPrice: product.unitPrice,
            product: {
                productID: 0,
                name: '',
                description: '',
                unitPrice: 0,
                state: false,
                stock: 0,
                imageUrl: undefined,
                category: undefined
            }
        }, {
            onSuccess: (data) => {
                console.log("Se agrego correctamente:  ",data)
            },
            onError: (error) => {
                console.log(error)
            }
        })
    }


    return (
        <div className="min-h-screen bg-linear-to-b from-black via-gray-900 to-gray-800 text-slate-100">
            <header className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-linear-to-br from-indigo-500 to-cyan-400 rounded-full flex items-center justify-center text-xl font-bold text-black">E</div>
                        <div>
                            <h1 className="text-2xl font-extrabold tracking-tight">ElectroPulse</h1>
                            <p className="text-sm text-indigo-300">Lo último en hardware y accesorios para PC</p>
                        </div>
                    </div>
                    <nav className="hidden md:flex gap-6 text-indigo-200">
                        <Link className="hover:text-white" to="/products">Productos</Link>
                    </nav>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 pb-20">
                <section className="grid md:grid-cols-2 gap-8 items-center mb-12">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">Diseño futurista. Rendimiento real.</h2>
                        <p className="mt-4 text-indigo-200 max-w-xl">Explora nuestra selección curada de componentes y periféricos pensados para gamers, creadores y profesionales de alto rendimiento. Tecnología que se ve tan bien como rinde.</p>

                        <div className="mt-6 flex gap-4">
                            <Link to="/products">
                                <button className="px-6 py-3 bg-linear-to-r from-indigo-500 to-cyan-400 rounded-full text-black font-semibold shadow-lg cursor-pointer hover:scale-105 transform transition">
                                    Ver Colección
                                </button>
                            </Link>
                        </div>

                        <div className="mt-8 grid grid-cols-3 gap-3">

                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center">🔒</div>
                                <div className="text-sm">
                                    <div className="font-semibold">Pago seguro</div>
                                    <div className="text-indigo-300 text-xs">Protección total</div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div>
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                            <div className="absolute inset-0 bg-linear-to-tr from-indigo-600/30 via-transparent to-cyan-500/20 mix-blend-screen pointer-events-none" />
                            <img alt="hero" src="/venta_hardware.jpg" className="w-full h-80 object-cover scale-110" />
                        </div>
                    </div>
                </section>

                <section className="mb-12">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-2xl font-bold">Por menos de 100.000</h3>
                        <p className="text-indigo-200 text-sm">4 productos aleatorios bajo ese precio</p>
                    </div>

                    {loading && (
                        <p className="text-indigo-200">Cargando productos...</p>
                    )}

                    {error && (
                        <p className="text-red-300">{error.message}</p>
                    )}

                    {!loading && !error && featuredUnder100.length === 0 && (
                        <p className="text-indigo-200">No hay productos bajo 100.000 por ahora.</p>
                    )}

                    {!loading && !error && featuredUnder100.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                            {featuredUnder100.map((p) => (
                                <ProductCard isInCart={isProductInCart(p.productID)} handleAgregar={() => handleAgregarProductoCarrito(p)} key={p.productID} p={p} />
                            ))}
                        </div>
                    )}
                </section>

                <section className="mb-12">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-2xl font-bold">Entre 100.000 y 200.000</h3>
                        <p className="text-indigo-200 text-sm">4 productos aleatorios en ese rango</p>
                    </div>

                    {loading && (
                        <p className="text-indigo-200">Cargando productos...</p>
                    )}

                    {error && (
                        <p className="text-red-300">{error.message}</p>
                    )}

                    {!loading && !error && featuredBetween100And200.length === 0 && (
                        <p className="text-indigo-200">No hay productos en ese rango por ahora.</p>
                    )}

                    {!loading && !error && featuredBetween100And200.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                            {featuredBetween100And200.map((p) => (
                                <ProductCard isInCart={isProductInCart(p.productID)} handleAgregar={() => handleAgregarProductoCarrito(p)} key={p.productID} p={p} />
                            ))}
                        </div>
                    )}
                </section>

                <section className="mt-12 bg-gradient-to-r from-white/3 to-white/2 border border-white/5 rounded-2xl p-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div>
                            <h4 className="text-xl font-bold">¿Armas tu PC?</h4>
                            <p className="text-indigo-300">Encuentra combos, kits y asesoría para montajes con estilo y potencia. Contactanos vía whatsapp.</p>
                        </div>
                        <div>
                            <a 
                                href="https://wa.me/56988300793" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-5 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold cursor-pointer transition"
                            >
                                <span className="text-2xl">📞</span>
                                <span>+56 9 8830 0793</span>
                            </a>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="border-t border-white/6 mt-12 py-8">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-indigo-300">© {new Date().getFullYear()} ElectroPulse — Accesorios y componentes</div>
                    <div className="flex gap-4 text-indigo-200">
                        <a>Privacidad</a>
                        <a>Términos</a>
                        <a>Soporte</a>
                    </div>
                </div>
            </footer>

            <LoginRequiredDialog 
                visible={showLoginRequired} 
                onHide={() => setShowLoginRequired(false)} 
                onLogin={() => navigate('/login', { replace: true })}            
            />
        </div>
    )
}

