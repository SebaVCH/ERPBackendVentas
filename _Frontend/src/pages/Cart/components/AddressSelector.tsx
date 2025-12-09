import { useState } from "react"
import { Button } from "primereact/button"
import { Dialog } from "primereact/dialog"
import { RadioButton } from "primereact/radiobutton"
import type { Address } from "../../../types/Address"
import { useClientAddress } from "../../../api/queries/useClients"
import { Link } from "react-router-dom"

interface AddressSelectorProps {
    clientID: number
    onAddressSelect: (address: Address) => void
}

export default function AddressSelector({ clientID, onAddressSelect }: AddressSelectorProps) {
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)
    const [showDialog, setShowDialog] = useState(false)
    const { data: addresses = [], isLoading } = useClientAddress(clientID)
    

    const handleSelectAddress = (address: Address) => {
        setSelectedAddress(address)
        onAddressSelect(address)
        setShowDialog(false)
    }

    return (
        <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Dirección de envío</h3>
            
            {!selectedAddress ? (
                <div 
                    onClick={() => setShowDialog(true)}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all"
                >
                    <div className="flex items-center gap-3">
                        <i className="pi pi-map-marker text-gray-400 text-2xl"></i>
                        <div>
                            <p className="font-semibold text-gray-700">Selecciona una dirección</p>
                            <p className="text-sm text-gray-500">Haz clic para elegir tu dirección de envío</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="border-2 border-blue-500 bg-blue-50 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                            <i className="pi pi-map-marker text-blue-600 text-2xl mt-1"></i>
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <p className="font-bold text-gray-800">{selectedAddress.label}</p>
                                    {selectedAddress.isDefault && (
                                        <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                                            Por defecto
                                        </span>
                                    )}
                                </div>
                                <p className="text-gray-700">
                                    {selectedAddress.street} {selectedAddress.number}
                                </p>
                                <p className="text-gray-600 text-sm">
                                    {selectedAddress.commune}, {selectedAddress.city}
                                </p>
                                <p className="text-gray-600 text-sm">
                                    {selectedAddress.region} - CP: {selectedAddress.postalCode}
                                </p>
                            </div>
                        </div>
                        <Button
                            icon="pi pi-pencil"
                            text
                            rounded
                            severity="secondary"
                            onClick={() => setShowDialog(true)}
                            tooltip="Cambiar dirección"
                        />
                    </div>
                </div>
            )}

            <Dialog
                header="Selecciona una dirección de envío"
                visible={showDialog}
                style={{ width: '600px' }}
                onHide={() => setShowDialog(false)}
                draggable={false}
            >
                {isLoading ? (
                    <div className="text-center py-8">
                        <i className="pi pi-spin pi-spinner text-4xl text-blue-600"></i>
                        <p className="mt-4 text-gray-600">Cargando direcciones...</p>
                    </div>
                ) : addresses.length === 0 ? (
                    <div className="text-center py-8">
                        <i className="pi pi-map-marker text-gray-300 text-6xl mb-4"></i>
                        <p className="text-gray-600 mb-2">No tienes direcciones guardadas</p>
                        <Link className="text-sm text-gray-500 underline" to={"/mi-perfil"}>Agrega una dirección para continuar</Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {addresses.map((address) => (
                            <div
                                key={address.id}
                                className={`border-2 rounded-lg p-4 cursor-pointer transition-all hover:border-blue-400 ${
                                    selectedAddress?.id === address.id
                                        ? 'border-blue-600 bg-blue-50'
                                        : 'border-gray-200 hover:bg-gray-50'
                                }`}
                                onClick={() => handleSelectAddress(address)}
                            >
                                <div className="flex items-start gap-3">
                                    <RadioButton
                                        checked={selectedAddress?.id === address.id}
                                        onChange={() => handleSelectAddress(address)}
                                        className="mt-1"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <p className="font-bold text-gray-800">{address.label}</p>
                                            {address.isDefault && (
                                                <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                                                    Por defecto
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-gray-700">
                                            {address.street} {address.number}
                                        </p>
                                        <p className="text-gray-600 text-sm">
                                            {address.commune}, {address.city}
                                        </p>
                                        <p className="text-gray-600 text-sm">
                                            {address.region} - CP: {address.postalCode}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Dialog>
        </div>
    )
}