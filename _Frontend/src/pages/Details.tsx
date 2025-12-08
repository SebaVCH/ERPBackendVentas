import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useProductDetails } from '../api/queries/useProductDetails'
import type { ProductDetail } from '../types/ProductDetail'
import { LoadingState } from '../components/LoadingState'
import { ErrorState } from '../components/ErrorState'

const formatCLP = (value: number) =>
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value)

function ProductDetailCard({ productDetail }: { productDetail: ProductDetail }) {
    const navigate = useNavigate()
    const agotado = productDetail.product.stock <= 0
    
    const handleViewDetails = () => {
        navigate(`/details/${productDetail.product.productID}`)
    }

    return (
        <div className="bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-lg hover:scale-105 transform transition">
            <div className="relative h-48 w-full">
                <img
                    src={productDetail.imageUrl}
                    alt={productDetail.product.name}
                    className="object-cover w-full h-full"
                />
                <span
                    className={`absolute top-3 left-3 text-xs text-white px-2 py-1 rounded-full ${
                        agotado ? 'bg-red-500/90' : 'bg-indigo-500/90'
                    }`}
                >
                    {agotado ? 'Agotado' : 'En stock'}
                </span>
                <span className="absolute top-3 right-3 text-xs text-white px-2 py-1 rounded-full bg-purple-500/90">
                    {productDetail.category}
                </span>
            </div>

            <div className="p-4">
                <h3 className="text-white font-semibold line-clamp-2">{productDetail.product.name}</h3>
                <p className="text-indigo-200 text-sm mt-2 line-clamp-3">{productDetail.product.description}</p>

                <div className="mt-4 flex items-center justify-between">
                    <p className="text-indigo-300 font-semibold">{formatCLP(productDetail.product.unitPrice)}</p>
                    <p className="text-xs text-indigo-300">
                        Stock: <span className="font-semibold">{productDetail.product.stock}</span>
                    </p>
                </div>

                <div className="mt-4 flex gap-2">
                    <button
                        className={`px-3 py-2 rounded-md text-sm font-medium flex-1 ${
                            agotado
                                ? 'bg-gray-500/60 text-gray-300 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                        }`}
                        disabled={agotado}
                    >
                        Agregar al carrito
                    </button>
                    <button 
                        onClick={handleViewDetails}
                        className="px-3 py-2 border border-white/10 text-indigo-200 rounded-md text-sm hover:bg-white/5"
                    >
                        Ver detalles
                    </button>
                </div>
            </div>
        </div>
    )
}

export default function Details() {
    const { search } = useLocation()
    const { data: productDetails = [], isLoading: loading, error } = useProductDetails()

    const searchTerm = useMemo(() => {
        const params = new URLSearchParams(search)
        return (params.get('search') || '').toLowerCase().trim()
    }, [search])

    const filtered = useMemo(() => {
        if (!searchTerm) return productDetails
        return productDetails.filter((pd) =>
            `${pd.product.name} ${pd.product.description} ${pd.category}`.toLowerCase().includes(searchTerm)
        )
    }, [productDetails, searchTerm])

    const stats = useMemo(() => {
        if (!productDetails.length) return { total: '—', disponibles: '—', agotados: '—', categorias: '—' }
        const disponibles = productDetails.filter((pd) => pd.product.stock > 0).length
        const agotados = productDetails.filter((pd) => pd.product.stock <= 0).length
        const categorias = new Set(productDetails.map((pd) => pd.category)).size
        return {
            total: productDetails.length.toString(),
            disponibles: disponibles.toString(),
            agotados: agotados.toString(),
            categorias: categorias.toString()
        }
    }, [productDetails])

    if (loading) return <LoadingState message="Cargando productos con detalles..." />
    if (error) return <ErrorState title="Error al cargar productos" message={error instanceof Error ? error.message : 'Ocurrió un error inesperado'} />

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Productos con Detalles Extra</h1>
                    <p className="text-indigo-200">Explora nuestro catálogo detallado de productos</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
                        <p className="text-indigo-300 text-sm">Total</p>
                        <p className="text-2xl font-bold text-white">{stats.total}</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
                        <p className="text-indigo-300 text-sm">Disponibles</p>
                        <p className="text-2xl font-bold text-green-400">{stats.disponibles}</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
                        <p className="text-indigo-300 text-sm">Agotados</p>
                        <p className="text-2xl font-bold text-red-400">{stats.agotados}</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
                        <p className="text-indigo-300 text-sm">Categorías</p>
                        <p className="text-2xl font-bold text-purple-400">{stats.categorias}</p>
                    </div>
                </div>

                {/* Search Info */}
                {searchTerm && (
                    <div className="mb-6 p-4 bg-indigo-500/20 border border-indigo-400/30 rounded-lg">
                        <p className="text-indigo-200">
                            Mostrando <span className="font-semibold text-white">{filtered.length}</span> resultado(s) para: 
                            <span className="font-semibold text-white ml-1">"{searchTerm}"</span>
                        </p>
                    </div>
                )}

                {/* Products Grid */}
                {filtered.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-indigo-300 text-lg">
                            {searchTerm 
                                ? 'No se encontraron productos con ese criterio de búsqueda'
                                : 'No hay productos disponibles en este momento'
                            }
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filtered.map((productDetail) => (
                            <ProductDetailCard key={productDetail.extraDetailID} productDetail={productDetail} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
