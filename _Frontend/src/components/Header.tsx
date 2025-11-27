import { InputText } from 'primereact/inputtext';
import { Avatar } from 'primereact/avatar';
import { Badge } from 'primereact/badge';
import 'primeicons/primeicons.css';

export default function Header() {
    return (
        <header className="bg-white shadow-md border-b border-gray-200">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center">
                        <h1 className="text-2xl font-bold text-black">Aqui deberia ir el logo</h1>
                    </div>

                    <div className="p-inputgroup flex1 ">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-search"></i>
                        </span>
                        <InputText placeholder="Busqueda" />
                    </div>

                    <div>
                        <Avatar className="p-overlay-badge" icon="pi pi-user" size="xlarge">
                            <Badge value="9999" />
                        </Avatar>
                    </div>
                </div>
            </div>
        </header>
    );
}

