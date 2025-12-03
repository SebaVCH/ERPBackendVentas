import { Button } from "primereact/button"
import { Card } from "primereact/card"
import { Divider } from "primereact/divider"
import type { UserProfile } from "../../Profile"



export type ProfileSectionProps = {
    userProfile: UserProfile
    onClickEdit: () => void
}


export default function ProfileSection({ onClickEdit, userProfile } : ProfileSectionProps) {
    return (
        <Card className="shadow-lg">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Mi Perfil</h2>
                <Button
                    label="Editar"
                    icon="pi pi-pencil"
                    outlined
                    onClick={onClickEdit}
                />
            </div>
            <div className="space-y-4">
                <div>
                    <label className="text-sm text-gray-600">Nombre completo</label>
                    <p className="text-lg font-semibold text-gray-800">{userProfile.name}</p>
                </div>
                <Divider />
                <div>
                    <label className="text-sm text-gray-600">Correo electrónico</label>
                    <p className="text-lg font-semibold text-gray-800">{userProfile.email}</p>
                </div>
                <Divider />
                <div>
                    <label className="text-sm text-gray-600">Teléfono</label>
                    <p className="text-lg font-semibold text-gray-800">{userProfile.phone}</p>
                </div>
            </div>
        </Card>
    )  
};


