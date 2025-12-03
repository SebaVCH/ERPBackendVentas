import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import type { UserProfile } from "../../Profile";



type EditProfileDialogProps = {
    isOpen : boolean
    onClose: () => void
    editForm : UserProfile
    updateField: (field: keyof UserProfile, value: string) => void
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
                        Nombre completo
                    </label>
                    <InputText
                        id="edit-name"
                        value={editForm.name}
                        onChange={(e) => updateField("name", e.target.value)}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="edit-email" className="font-semibold text-gray-700">
                        Correo electrónico
                    </label>
                    <InputText
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
