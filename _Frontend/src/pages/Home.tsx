type Product = {
    id: number;
    name: string;
    price: string;
    img: string;
    tag?: string;
};

const sampleProducts: Product[] = [
    { id: 1, name: "Teclado Mecánico RGB X-1", price: "$89.99", img: "https://image.pngaaa.com/367/1268367-small.png" , tag: "Nuevo"},
    { id: 2, name: "Auriculares Gaming Nebula", price: "$129.99", img: "https://image.pngaaa.com/367/1268367-small.png", tag: "Top" },
    { id: 3, name: "Mouse Óptico Phantom", price: "$49.99", img: "https://image.pngaaa.com/367/1268367-small.png" },
    { id: 4, name: "Soporte RGB para Monitor", price: "$59.99", img: "https://image.pngaaa.com/367/1268367-small.png" }
];

function ProductCard({ p }: { p: Product }) {
    return (
        <div className="bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-lg hover:scale-105 transform transition">
            <div className="relative h-44 w-full">
                <img src={p.img} alt={p.name} className="object-cover w-full h-full" />
                {p.tag && (
                    <span className="absolute top-3 left-3 bg-indigo-500/90 text-xs text-white px-2 py-1 rounded-full">{p.tag}</span>
                )}
            </div>
            <div className="p-4">
                <h3 className="text-white font-semibold">{p.name}</h3>
                <p className="text-indigo-300 mt-2">{p.price}</p>
                <div className="mt-4 flex gap-2">
                    <button className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-sm">Agregar</button>
                    <button className="px-3 py-2 border border-white/10 text-indigo-200 rounded-md text-sm">Ver</button>
                </div>
            </div>
        </div>
    );
}

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 text-slate-100">
            <header className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-cyan-400 rounded-full flex items-center justify-center text-xl font-bold text-black">E</div>
                        <div>
                            <h1 className="text-2xl font-extrabold tracking-tight">ElectroPulse</h1>
                            <p className="text-sm text-indigo-300">Lo último en hardware y accesorios para PC</p>
                        </div>
                    </div>
                    <nav className="hidden md:flex gap-6 text-indigo-200">
                        <a className="hover:text-white">Productos</a>
                        <a className="hover:text-white">Ofertas</a>
                        <a className="hover:text-white">Accesorios</a>
                        <a className="hover:text-white">Contacto</a>
                    </nav>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 pb-20">
                <section className="grid md:grid-cols-2 gap-8 items-center mb-12">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">Diseño futurista. Rendimiento real.</h2>
                        <p className="mt-4 text-indigo-200 max-w-xl">Explora nuestra selección curada de componentes y periféricos pensados para gamers, creadores y profesionales de alto rendimiento. Tecnología que se ve tan bien como rinde.</p>

                        <div className="mt-6 flex gap-4">
                            <button className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full text-black font-semibold shadow-lg">Ver Colección</button>
                            <button className="px-6 py-3 border border-white/10 rounded-full text-indigo-200">Ofertas</button>
                        </div>

                        <div className="mt-8 grid grid-cols-3 gap-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center">⚡</div>
                                <div className="text-sm">
                                    <div className="font-semibold">Envío rápido</div>
                                    <div className="text-indigo-300 text-xs">24-48 horas</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center">🔒</div>
                                <div className="text-sm">
                                    <div className="font-semibold">Pago seguro</div>
                                    <div className="text-indigo-300 text-xs">Protección total</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center">✨</div>
                                <div className="text-sm">
                                    <div className="font-semibold">Garantía</div>
                                    <div className="text-indigo-300 text-xs">12 meses</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/30 via-transparent to-cyan-500/20 mix-blend-screen pointer-events-none" />
                            <img alt="hero" src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=5" className="w-full h-80 object-cover" />
                        </div>
                    </div>
                </section>

                <section className="mb-12">
                    <h3 className="text-2xl font-bold mb-6">Productos destacados</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {sampleProducts.map(p => (
                            <ProductCard key={p.id} p={p} />
                        ))}
                    </div>
                </section>

                <section className="mt-12 bg-gradient-to-r from-white/3 to-white/2 border border-white/5 rounded-2xl p-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div>
                            <h4 className="text-xl font-bold">¿Armas tu PC?</h4>
                            <p className="text-indigo-300">Encuentra combos, kits y asesoría para montajes con estilo y potencia.</p>
                        </div>
                        <div>
                            <button className="px-5 py-3 bg-cyan-400 text-black rounded-lg font-semibold">Explorar kits</button>
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
        </div>
    );
}

