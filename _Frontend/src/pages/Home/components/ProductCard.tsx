import type { Product } from "../../../types/Product"
import { formatCLP } from "../../../utils/format"
import { Link } from "react-router-dom"

interface ProductCardProps {
    p: Product
    handleAgregar: () => void
    isInCart?: boolean
}

export function ProductCard({ p, handleAgregar, isInCart = false }: ProductCardProps) {
    const agotado = p.stock <= 0
    
    return (
        <div className="bg-linear-to-br from-white/5 to-white/2 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-lg hover:scale-105 transform transition">
            <div className="relative h-44 w-full">
                <img
                    src={p.imageUrl || '/1.png'}
                    alt={p.name}
                    className="object-cover w-full h-full"
                />
                <span
                    className={`absolute top-3 left-3 text-xs text-white px-2 py-1 rounded-full ${
                        agotado ? 'bg-red-500/90' : 'bg-indigo-500/90'
                    }`}
                >
                    {agotado ? 'Agotado' : 'En stock'}
                </span>
                {isInCart && !agotado && (
                    <span className="absolute top-3 right-3 text-xs text-white px-2 py-1 rounded-full bg-green-500/90 font-semibold flex items-center gap-1">
                        <span>✓</span>
                        <span>En carrito</span>
                    </span>
                )}
            </div>
            <div className="p-4">
                <h3 className="text-white font-semibold line-clamp-2">{p.name}</h3>
                <p className="text-indigo-300 mt-2">{formatCLP(p.unitPrice)}</p>
                <p className="text-indigo-200 text-xs mt-1 line-clamp-2">{p.description}</p>
                <div className="mt-4 flex gap-2">
                    <button
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            agotado
                                ? 'bg-gray-500/60 text-gray-300 cursor-not-allowed'
                                : isInCart
                                ? 'bg-white/10 text-green-300 border border-green-500/30 hover:bg-white/15'
                                : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                        }`}
                        disabled={agotado}
                        onClick={handleAgregar}
                    >
                        {isInCart ? 'Ver Carrito' : 'Agregar'}
                    </button>
                    <Link to={`/products/${p.productID}`} className="px-3 py-2 border border-white/10 text-indigo-200 rounded-md text-sm hover:bg-white/5">
                        Ver
                    </Link>
                </div>
            </div>
        </div>
    )
}