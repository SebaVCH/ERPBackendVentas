import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useProducts } from '../api/queries/useProducts'
import { useProductDetails } from '../api/queries/useProductDetails'
import type { Product } from '../types/Product'
import { useCheckToken } from '../api/queries/useAuth'
import { useAddItemToCart, useCart } from '../api/queries/useCart'
import LoginRequiredDialog from './Home/components/LoginRequiredDialog'
import { ProductCard } from './Home/components/ProductCard'


export default function Products() {
    const navigate = useNavigate()
    const { search } = useLocation()
    const { data: products = [], isLoading: loading, error } = useProducts()
    const { data: productDetails = [] } = useProductDetails()
    const { data: checkToken } = useCheckToken()
    const clientID = checkToken?.clientID as number
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

    const searchTerm = useMemo(() => {
        const params = new URLSearchParams(search)
        return (params.get('search') || '').toLowerCase().trim()
    }, [search])

    const filtered = useMemo(() => {
        if (!searchTerm) return productsWithDetails
        return productsWithDetails.filter((p) =>
            `${p.name} ${p.description}`.toLowerCase().includes(searchTerm)
        )
    }, [productsWithDetails, searchTerm])

    const stats = useMemo(() => {
        if (!productsWithDetails.length) return { total: '—', disponibles: '—', agotados: '—' }
        const disponibles = productsWithDetails.filter((p) => p.stock > 0).length
        const agotados = productsWithDetails.filter((p) => p.stock <= 0).length
        return {
            total: `${productsWithDetails.length}`,
            disponibles: `${disponibles}`,
            agotados: `${agotados}`,
        }
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
            <div className="max-w-7xl mx-auto px-6 py-12">
                <section className="grid md:grid-cols-5 gap-10 items-center">
                    <div className="md:col-span-3">
                        <p className="text-sm uppercase text-indigo-300 font-semibold tracking-wide">Catálogo</p>
                        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mt-2">Todos los productos</h1>
                        <p className="mt-4 text-indigo-200 max-w-2xl">
                            Estilo futurista del Home, pero con la lista completa desde el backend.
                            Explora hardware, redes y periféricos listos para tu setup.
                        </p>
                        <div className="mt-6 flex gap-3">
                            <span className="px-4 py-2 bg-linear-to-r from-indigo-500 to-cyan-400 text-black rounded-full text-sm font-semibold shadow-lg">
                                Stock en vivo
                            </span>
                            <span className="px-4 py-2 border border-white/10 text-indigo-200 rounded-full text-sm">
                                Envíos 24-48h
                            </span>
                        </div>
                    </div>

                    <div className="md:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
                        <h2 className="text-lg font-semibold mb-4 text-white">Resumen rápido</h2>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white/5 border border-white/10 rounded-lg p-4 flex flex-col gap-2">
                                <span className="text-sm text-indigo-200">Total</span>
                                <span className="text-2xl font-bold text-white">{stats.total}</span>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-lg p-4 flex flex-col gap-2">
                                <span className="text-sm text-indigo-200">Disponibles</span>
                                <span className="text-2xl font-bold text-emerald-300">{stats.disponibles}</span>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-lg p-4 flex flex-col gap-2">
                                <span className="text-sm text-indigo-200">Agotados</span>
                                <span className="text-2xl font-bold text-red-300">{stats.agotados}</span>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-lg p-4 flex flex-col gap-2">
                                <span className="text-sm text-indigo-200">Moneda</span>
                                <span className="text-2xl font-bold text-indigo-300">CLP</span>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mt-10">
                    {loading && (
                        <div className="flex justify-center items-center py-16 text-indigo-200">
                            Cargando productos...
                        </div>
                    )}

                    {error && (
                        <div className="mt-6 bg-red-500/10 border border-red-400/40 text-red-200 px-4 py-3 rounded-lg">
                            Ocurrió un error al cargar los productos: {error.message}
                        </div>
                    )}

                    {!loading && !error && filtered.length === 0 && (
                        <p className="mt-6 text-indigo-200">No hay productos disponibles por el momento.</p>
                    )}

                    {!loading && !error && filtered.length > 0 && (
                        <>
                            {searchTerm && (
                                <p className="mb-4 text-indigo-200">
                                    Resultados para "{searchTerm}" ({filtered.length})
                                </p>
                            )}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {filtered.map((product) => (
                                    <ProductCard isInCart={isProductInCart(product.productID)}  key={product.productID} p={product} handleAgregar={() => handleAgregarProductoCarrito(product)} />
                                ))}
                            </div>
                        </>
                    )}
                </section>
            </div>
            <LoginRequiredDialog 
                visible={showLoginRequired} 
                onHide={() => setShowLoginRequired(false)} 
                onLogin={() => navigate('/login', { replace: true })}            
            />
        </div>
    )
}
