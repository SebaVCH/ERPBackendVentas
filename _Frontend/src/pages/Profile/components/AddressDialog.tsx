import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import type { Address } from "../../../types/Address";


type AddressPutDialogProps = {
    title: string
    submitButtonMsg : string
    isOpen: boolean
    onClose: () => void
    address: Omit<Address, "id">
    updateField: (field: keyof Address, value: Address[typeof field]) => void
    handleSubmit: () => void
}

export default function AddressPutDialog({ title, isOpen, onClose, address, updateField, handleSubmit, submitButtonMsg } : AddressPutDialogProps) {
    return (            
        <Dialog
            header={title}
            visible={isOpen}
            style={{ width: '450px' }}
            onHide={onClose}
        >
            <div className="space-y-4">
                <div className="flex flex-col gap-2">
                    <label className="font-semibold text-gray-700">Nombre de la dirección</label>
                    <InputText
                        value={address.label}
                        onChange={(e) => updateField("label", e.target.value)}
                        placeholder="Ej: Casa, Trabajo"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="font-semibold text-gray-700">Calle</label>
                        <InputText
                            value={address.street}
                            onChange={(e) => updateField("street", e.target.value)}
                            placeholder="Av. Principal 123, Depto 4B"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="font-semibold text-gray-700">Número</label>
                        <InputText
                            value={address.number}
                            onChange={(e) => updateField("number", e.target.value)}
                            placeholder="123"
                        />
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                        <label className="font-semibold text-gray-700">Comuna</label>
                        <InputText
                            value={address.number}
                            onChange={(e) => updateField("commune", e.target.value)}
                            placeholder="Florida"
                        />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="font-semibold text-gray-700">Ciudad</label>
                        <InputText
                            value={address.city}
                            onChange={(e) => updateField("city", e.target.value)}
                            placeholder="Santiago"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="font-semibold text-gray-700">Región</label>
                        <InputText
                            value={address.region}
                            onChange={(e) => updateField("region", e.target.value)}
                            placeholder="Metropolitana"
                        />
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <label className="font-semibold text-gray-700">Código Postal</label>
                    <InputText
                        value={address.postalCode}
                        onChange={(e) => updateField("postalCode", e.target.value)}
                        placeholder="1000000"
                    />
                </div>
                <div className="flex gap-2 justify-end mt-6">
                    <Button
                        label="Cancelar"
                        outlined
                        onClick={onClose}
                    />
                    <Button
                        label={submitButtonMsg}
                        onClick={handleSubmit}
                    />
                </div>
            </div>
        </Dialog>
    )
}

