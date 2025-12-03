import { Button } from "primereact/button"
import { Card } from "primereact/card"
import { Divider } from "primereact/divider"
import type { Client } from "../../../types/Client"
import { Skeleton } from "primereact/skeleton"
import { useState } from "react"
import EditProfileDialog from "../components/EditProfileDialog"



export type ProfileSectionProps = {
    userProfile?: Client
    isLoading?: boolean
}



const initForm : Client = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    id: 0,
    state: ""
} 



export default function ProfileSection({ userProfile, isLoading } : ProfileSectionProps) {
    
    const [ visible, setVisible ] = useState(false)
    const [ editProfileForm, setEditProfileForm ] = useState<Client>(initForm)
    
    
    const handleEditProfile = () => {
        // setUserProfile(editForm);
        setVisible(false);
    };
    

    const onClickEdit = () => {
        if(!userProfile) return

        setEditProfileForm(userProfile);
        setVisible(true);
    }
        
    return (
        <div>
            <Card className="shadow-lg">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Mi Perfil</h2>
                    { isLoading && !userProfile ? 
                        <Skeleton height="49px" width="100px"></Skeleton> : 
                        <Button
                            label="Editar - PENDIENTE"
                            icon="pi pi-pencil"
                            outlined
                            severity="contrast"
                            onClick={onClickEdit}
                        />
                    }
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="text-sm text-gray-600">Nombre completo</label>
                        { isLoading || !userProfile ? 
                            <Skeleton height="28px"  width="10rem"></Skeleton> :
                            <p className="text-lg font-semibold text-gray-800">{userProfile.firstName + " " + userProfile.lastName}</p>
                        }
                    </div>
                    <Divider />
                    <div>
                        <label className="text-sm text-gray-600">Correo electrónico</label>
                        { isLoading || !userProfile ?
                            <Skeleton height="28px" width="20rem"></Skeleton> :
                            <p className="text-lg font-semibold text-gray-800">{userProfile.email}</p>
                        }
                    </div>
                    <Divider />
                    <div>
                        <label className="text-sm text-gray-600">Teléfono</label>
                        { isLoading || !userProfile ? 
                            <Skeleton height="28px"  width="10rem"></Skeleton> :
                            <p className="text-lg font-semibold text-gray-800">{userProfile.phone}</p>
                        }
                    </div>
                </div>
            </Card>
            <EditProfileDialog 
                isOpen={visible} 
                onClose={() => setVisible(false)} 
                editForm={editProfileForm} 
                handleSubmit={handleEditProfile}
                updateField={(field: keyof Client, value: string) => setEditProfileForm(prev => ({ ...prev, [field]: value }))}            
            />
        </div>
    )  
};


