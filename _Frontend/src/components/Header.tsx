import { InputText } from 'primereact/inputtext';
import { Avatar } from 'primereact/avatar';
import { Badge } from 'primereact/badge';
import 'primeicons/primeicons.css';

export default function Header() {
    return (
        <header className="bg-white shadow-md border-b border-gray-200">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center gap-6">
                    <div className="flex-shrink-0">
                        <h1 className="text-2xl font-bold text-black whitespace-nowrap">Aquí debería ir el logo</h1>
                    </div>

                    <div className="flex-grow max-w-2xl mx-auto">
                        <div className="p-inputgroup">
                            <span className="p-inputgroup-addon">
                                <i className="pi pi-search"></i>
                            </span>
                            <InputText placeholder="Buscar productos..." className="w-full" />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                        <Avatar className="p-overlay-badge cursor-pointer" icon="pi pi-shopping-cart" size="xlarge">
                            <Badge value="9999" />
                        </Avatar>
                        <Avatar className="cursor-pointer" icon="pi pi-user" size="xlarge"></Avatar>
                    </div>
                </div>
            </div>
        </header>
    );
}

