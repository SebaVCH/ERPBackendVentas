import { Card } from "primereact/card"
import type { Address } from "../../Profile"
import { Button } from "primereact/button"
import { Tag } from "primereact/tag"



export type AddressSectionProps = {
    handleAgregarDireccion: () => void 
    addresses: Address[]
    handleEditAddress: (address : Address) => void
    handleDeleteAddress: (idAddress : string) => void
    handleDefaultAddress: (idAddress : string) => void
}


export default function AddressSection({ handleAgregarDireccion, addresses, handleDefaultAddress, handleDeleteAddress, handleEditAddress } : AddressSectionProps) {
    return (
        <Card className="shadow-lg">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Mis Direcciones</h2>
                <Button
                    label="Agregar"
                    icon="pi pi-plus"
                    onClick={handleAgregarDireccion}
                />
            </div>

            <div className="space-y-4">
                {addresses.map((address) => (
                    <Card key={address.id} className="bg-gray-50">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <h3 className="font-bold text-gray-800">{address.name}</h3>
                                    {address.isDefault && (
                                        <Tag value="Predeterminada" severity="success" />
                                    )}
                                </div>
                                <p className="text-gray-700">{address.street}</p>
                                <p className="text-gray-600">{address.city}, {address.region}</p>
                                <p className="text-gray-600">CP: {address.postalCode}</p>
                                <p className="text-gray-600">Tel: {address.phone}</p>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    icon="pi pi-pencil"
                                    rounded
                                    outlined
                                    severity="secondary"
                                    onClick={() => handleEditAddress(address)}
                                />
                                {!address.isDefault && (
                                    <Button
                                        icon="pi pi-trash"
                                        rounded
                                        outlined
                                        severity="danger"
                                        onClick={() => handleDeleteAddress(address.id)}
                                    />
                                )}
                                {!address.isDefault && (
                                    <Button
                                        label="Hacer predeterminada"
                                        outlined
                                        size="small"
                                        onClick={() => handleDefaultAddress(address.id)}
                                    />
                                )}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </Card>
    )
};
