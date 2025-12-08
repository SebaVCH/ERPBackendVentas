import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import type { Client } from "../../../types/Client";
import type { ClientUpdate } from "../../../api/adapter/client.adapter";



type EditProfileDialogProps = {
    isOpen : boolean
    onClose: () => void
    editForm : ClientUpdate
    updateField: (field: keyof Client, value: string) => void
    handleSubmit : () => void
}


export default function EditProfileDialog({ isOpen, onClose, editForm, updateField, handleSubmit } : EditProfileDialogProps) {
    return (
        <Dialog
            header="Editar Perfil"
            visible={isOpen}
            style={{ width: '450px' }}
            onHide={onClose}
        >
            <div className="space-y-4">
                <div className="flex flex-col gap-2">
                    <label htmlFor="edit-name" className="font-semibold text-gray-700">
                        Nombre 
                    </label>
                    <InputText
                        id="edit-name"
                        value={editForm.firstName}
                        onChange={(e) => updateField("firstName", e.target.value)}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="edit-name" className="font-semibold text-gray-700">
                        Apellido
                    </label>
                    <InputText
                        id="edit-name"
                        value={editForm.lastName}
                        onChange={(e) => updateField("lastName", e.target.value)}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="edit-email" className="font-semibold text-gray-700">
                        Correo electrónico
                    </label>
                    <InputText
                        disabled
                        id="edit-email"
                        type="email"
                        value={editForm.email}
                        onChange={(e) => updateField("email", e.target.value)}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="edit-phone" className="font-semibold text-gray-700">
                        Teléfono
                    </label>
                    <InputText
                        id="edit-phone"
                        value={editForm.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                    />
                </div>
                <div className="flex gap-2 justify-end mt-6">
                    <Button
                        label="Cancelar"
                        outlined
                        onClick={onClose}
                    />
                    <Button
                        label="Guardar"
                        onClick={handleSubmit}
                    />
                </div>
            </div>
        </Dialog>
    )    
};
