import { Button } from 'primereact/button';
import 'primeicons/primeicons.css';

export default function Footer() {
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <footer className="bg-black text-white py-8 mt-auto">
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center justify-center gap-4">
                    <div className="text-center">
                        <p className="text-lg font-semibold mb-2">Tus productos tecnologicos probados en animales.</p>
                        <p className="text-sm text-gray-400">
                            © {new Date().getFullYear()} e-commerce vegano digital ecofriendly mediafire no lo descargo porque ya lo tengo instalado. Todos los derechos reservados.
                        </p>
                    </div>

                    <div className="mt-2">
                        <Button
                            icon="pi pi-arrow-up"
                            rounded
                            text
                            onClick={scrollToTop}
                            aria-label="Volver arriba"
                            style={{
                                color: 'white',
                                width: '2.5rem',
                                height: '2.5rem'
                            }}
                            tooltip="Volver arriba"
                            tooltipOptions={{ position: 'top' }}
                        />
                    </div>
                </div>
            </div>
        </footer>
    );
}

