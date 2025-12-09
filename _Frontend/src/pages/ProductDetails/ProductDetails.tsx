import { useParams, Link, useNavigate } from 'react-router-dom'
import { useProducts } from '../../api/queries/useProducts'
import { useProductDetails } from '../../api/queries/useProductDetails'
import { useMemo, useState } from 'react'
import { formatCLP } from '../../utils/format'
import { useCheckToken } from '../../api/queries/useAuth'
import { useAddItemToCart, useCart } from '../../api/queries/useCart'
import type { Product } from '../../types/Product'
import LoginRequiredDialog from '../Home/components/LoginRequiredDialog'

export default function ProductDetails() {
    const navigate = useNavigate()
    const { data: checkToken } = useCheckToken()
    const clientID = checkToken?.clientID as number
    const { data: cart } = useCart(clientID)
    const { mutate: mutateAddItemCart } = useAddItemToCart()
    const [ showLoginRequired, setShowLoginRequired ] = useState(false) 
    const productsInCarts = cart?.cartProducts
    const isProductInCart = (productID: number) => {
        return productsInCarts?.some((item) => item.productID === productID) || false
    }


    const handleAgregarProductoCarrito = (product : Product) => {
        console.log("AOSNDADSON")
        if(!clientID) {
            setShowLoginRequired(true)
            return
        }
        if(isProductInCart(product.productID)) {
            navigate('/mi-carrito')
            return
        }
        mutateAddItemCart({
            clientID: clientID,
            productID: product.productID,
            amount: 1,
            unitPrice: product.unitPrice,
            product: product
        }, {
            onSuccess: (data) => {
                console.log("Se agrego correctamente:  ",data)
            },
            onError: (error) => {
                console.log(error)
            }
        })
    }


    const { id } = useParams<{ id: string }>()
    const { data: products = [], isLoading: loadingProducts } = useProducts()
    const { data: productDetails = [], isLoading: loadingDetails } = useProductDetails()

    const product = useMemo(() => {
        const prod = products.find(p => p.productID === Number(id))
        if (!prod) return null

        const detail = productDetails.find(d => d.productID === prod.productID)
        return {
            ...prod,
            imageUrl: detail?.imageUrl,
            category: detail?.category
        }
    }, [products, productDetails, id])

    const loading = loadingProducts || loadingDetails

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 text-slate-100 flex items-center justify-center">
                <p className="text-indigo-200">Cargando producto...</p>
            </div>
        )
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 text-slate-100">
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <div className="bg-red-500/10 border border-red-400/40 text-red-200 px-6 py-4 rounded-lg">
                        <h2 className="text-xl font-bold mb-2">Producto no encontrado</h2>
                        <p>No pudimos encontrar el producto que buscas.</p>
                        <Link to="/products" className="mt-4 inline-block text-indigo-300 hover:text-indigo-200 underline">
                            ← Volver a productos
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    const agotado = product.stock <= 0

    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 text-slate-100">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <Link to="/products" className="text-indigo-300 hover:text-indigo-200 mb-6 inline-flex items-center gap-2">
                    ← Volver a productos
                </Link>

                <div className="grid md:grid-cols-2 gap-10 mt-6">
                    {/* Imagen del producto con detalles debajo */}
                    <div className="flex flex-col gap-6">
                        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                            <img
                                src={product.imageUrl || '/1.png'}
                                alt={product.name}
                                className="w-full h-96 object-cover"
                            />
                        </div>

                        {/* Detalles del producto debajo de la imagen */}
                        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Detalles del producto</h3>
                            <div className="space-y-3 text-indigo-200">
                                <div className="flex justify-between border-b border-white/10 pb-2">
                                    <span className="font-medium">Nombre:</span>
                                    <span className="text-white text-right">{product.name}</span>
                                </div>
                                <div className="flex justify-between border-b border-white/10 pb-2">
                                    <span className="font-medium">ID del producto:</span>
                                    <span className="font-semibold text-white">{product.productID}</span>
                                </div>
                                {product.category && (
                                    <div className="flex justify-between border-b border-white/10 pb-2">
                                        <span className="font-medium">Categoría:</span>
                                        <span className="font-semibold text-white">{product.category}</span>
                                    </div>
                                )}
                                <div className="flex justify-between border-b border-white/10 pb-2">
                                    <span className="font-medium">Precio:</span>
                                    <span className="font-bold text-white text-lg">{formatCLP(product.unitPrice)}</span>
                                </div>
                                <div className="flex justify-between border-b border-white/10 pb-2">
                                    <span className="font-medium">Stock:</span>
                                    <span className="font-semibold text-white">{product.stock} unidades</span>
                                </div>
                                <div className="flex justify-between border-b border-white/10 pb-2">
                                    <span className="font-medium">Estado:</span>
                                    <span className={`font-semibold ${product.state ? 'text-emerald-300' : 'text-red-300'}`}>
                                        {product.state ? 'Activo' : 'Inactivo'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Disponibilidad:</span>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        agotado ? 'bg-red-500/20 text-red-300' : 'bg-emerald-500/20 text-emerald-300'
                                    }`}>
                                        {agotado ? 'Agotado' : 'En stock'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Información del producto */}
                    <div className="flex flex-col gap-6">
                        {product.category && (
                            <span className="inline-block px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-sm font-medium w-fit">
                                {product.category}
                            </span>
                        )}

                        <h1 className="text-4xl font-extrabold text-white">{product.name}</h1>

                        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-white mb-3">Descripción</h3>
                            <p className="text-indigo-200 leading-relaxed">{product.description}</p>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                            <div className="flex items-baseline gap-3 mb-4">
                                <span className="text-4xl font-bold text-white">{formatCLP(product.unitPrice)}</span>
                                <span className="text-sm text-indigo-300">IVA incluido</span>
                            </div>

                            <button
                                onClick={() => handleAgregarProductoCarrito(product)}
                                className={`w-full py-3 rounded-lg text-lg font-semibold transition ${
                                    agotado
                                        ? 'bg-gray-500/60 text-gray-300 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-indigo-500 to-cyan-400 text-black hover:scale-105'
                                }`}
                                disabled={agotado}
                            >
                                {agotado ? 'Producto agotado' : 'Agregar al carrito'}
                            </button>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Especificaciones técnicas</h3>
                            <div className="space-y-3 text-indigo-200 text-sm">
                                <div className="flex justify-between">
                                    <span>• Compatible con:</span>
                                    <span className="text-white">Múltiples plataformas</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>• Garantía:</span>
                                    <span className="text-white">12 meses</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>• Envío:</span>
                                    <span className="text-white">24-48 horas</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <LoginRequiredDialog 
                visible={showLoginRequired} 
                onHide={() => setShowLoginRequired(false)} 
                onLogin={() => navigate('/login', { replace: true })}            
            />
        </div>
    )
}
