import { Card } from "primereact/card"
import { Button } from "primereact/button"
import type { Address } from "../../../types/Address"
import AddressPutDialog from "../components/AddressDialog"
import { useState } from "react"
import { useDeleteAddress, useSubmitAddress } from "../../../api/queries/useAddress"



export type AddressSectionProps = {
    addresses: Address[]
    clientID: number
}

const initAddressForm : Address = {
    id: 0,
    label: "",
    street: "",
    city: "",
    region: "",
    postalCode: "",
    isDefault: false,
    clientID: 0,
    number: "",
    commune: ""
}

export default function AddressSection({ addresses, clientID } : AddressSectionProps) {
    
    const [visible, setVisible] = useState(false);
    const [editing, setEditing] = useState<Address | null>(null);
    const [form, setForm] = useState<Address>(initAddressForm);

    const { submit: submitAddress } = useSubmitAddress();
    const { mutate: removeAddress } = useDeleteAddress();

    const handleOpenNew = () => {
        setEditing(null);
        setForm({ ...initAddressForm, clientID });
        setVisible(true);
    };

    const handleOpenEdit = (addr: Address) => {
        setEditing(addr);
        setForm(addr);
        setVisible(true);
    };

    const handleDelete = (id: number) => {
        removeAddress(id);
    };

    const handleSubmit = () => {
        submitAddress(form, {
            onSuccess: () => {
                setVisible(false);
                setEditing(null);
                setForm(initAddressForm);
            }
        });
    };
        
    
    return (
        <div>
            <Card className="shadow-lg">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Mis Direcciones</h2>
                    <Button
                        label="Agregar"
                        icon="pi pi-plus"
                        onClick={handleOpenNew}
                        severity="contrast"
                    />
                </div>

                <div className="space-y-4">
                    {addresses.map((address) => (
                        <Card key={address.id} className="bg-gray-50! shadow-xs! border! border-gray-200!">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="font-bold text-gray-800">{address.label}</h3>
                                    </div>
                                    <p className="text-gray-700">{address.street}</p>
                                    <p className="text-gray-600">{address.city}, {address.region}</p>
                                    <p className="text-gray-600">CP: {address.postalCode}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        icon="pi pi-pencil"
                                        rounded
                                        outlined
                                        severity="secondary"
                                        onClick={() => handleOpenEdit(address)}
                                    />
                                    <Button
                                        icon="pi pi-trash"
                                        rounded
                                        outlined
                                        severity="danger"
                                        onClick={() => handleDelete(address.id)}
                                    />
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </Card>

            <AddressPutDialog 
                title={editing ? "Editar Dirección" : "Agregar Dirección"} 
                submitButtonMsg={editing ? "Actualizar" : "Agregar"} 
                isOpen={visible} 
                onClose={() => { setVisible(false); setEditing(null) }} 
                address={form} 
                updateField={(field: keyof Address, value: Address[typeof field]) => setForm(prev => ({...prev, [field]: value }))} 
                handleSubmit={handleSubmit}            
            />
        </div>
    )
};
