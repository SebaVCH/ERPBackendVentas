import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { useProducts } from '../api/queries/useProducts'
import type { Product } from '../types/Product'

const formatCLP = (value: number) =>
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value)

function ProductCard({ product }: { product: Product }) {
    const agotado = product.stock <= 0

    return (
        <div className="bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-lg hover:scale-105 transform transition">
            <div className="relative h-44 w-full">
                <img
                    src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop"
                    alt={product.name}
                    className="object-cover w-full h-full"
                />
                <span
                    className={`absolute top-3 left-3 text-xs text-white px-2 py-1 rounded-full ${
                        agotado ? 'bg-red-500/90' : 'bg-indigo-500/90'
                    }`}
                >
                    {agotado ? 'Agotado' : 'En stock'}
                </span>
            </div>

            <div className="p-4">
                <h3 className="text-white font-semibold line-clamp-2">{product.name}</h3>
                <p className="text-indigo-200 text-sm mt-2 line-clamp-3">{product.description}</p>

                <div className="mt-4 flex items-center justify-between">
                    <p className="text-indigo-300 font-semibold">{formatCLP(product.unitPrice)}</p>
                    <p className="text-xs text-indigo-300">
                        Stock: <span className="font-semibold">{product.stock}</span>
                    </p>
                </div>

                <div className="mt-4 flex gap-2">
                    <button
                        className={`px-3 py-2 rounded-md text-sm font-medium ${
                            agotado
                                ? 'bg-gray-500/60 text-gray-300 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                        }`}
                        disabled={agotado}
                    >
                        Agregar
                    </button>
                    <button className="px-3 py-2 border border-white/10 text-indigo-200 rounded-md text-sm">
                        Ver
                    </button>
                </div>
            </div>
        </div>
    )
}

export default function Products() {
    const { search } = useLocation()
    const { data: products = [], isLoading: loading, error } = useProducts()

    const searchTerm = useMemo(() => {
        const params = new URLSearchParams(search)
        return (params.get('search') || '').toLowerCase().trim()
    }, [search])

    const filtered = useMemo(() => {
        if (!searchTerm) return products
        return products.filter((p) =>
            `${p.name} ${p.description}`.toLowerCase().includes(searchTerm)
        )
    }, [products, searchTerm])

    const stats = useMemo(() => {
        if (!products.length) return { total: '—', disponibles: '—', agotados: '—' }
        const disponibles = products.filter((p) => p.stock > 0).length
        const agotados = products.filter((p) => p.stock <= 0).length
        return {
            total: `${products.length}`,
            disponibles: `${disponibles}`,
            agotados: `${agotados}`,
        }
    }, [products])

    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 text-slate-100">
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
                            <span className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-cyan-400 text-black rounded-full text-sm font-semibold shadow-lg">
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
                                    <ProductCard key={product.productID} product={product} />
                                ))}
                            </div>
                        </>
                    )}
                </section>
            </div>
        </div>
    )
}
