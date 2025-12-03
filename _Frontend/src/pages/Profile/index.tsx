import { useMemo, useState } from "react";
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import ProfileSection, { type ProfileSectionProps } from "./sections/ProfileSection";
import AddressPutDialog from "./components/AddressDialog";
import EditProfileDialog from "./components/EditProfileDialog";
import AddressSection, { type AddressSectionProps } from "./sections/AddressSection";
import { useClient } from "../../api/queries/useClients";
import CardHeader from "./components/CardHeader";
import type { Client } from "../../types/Client";
import { ProfileSectionSkeleton } from "./components/ProfileSectionSkeleton";
import type { Address } from "../../types/Address";


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ProfileSection<Props = any> = {
    id: string
    label: string
    icon: string
    component: React.FC<Props>
}


const profileSections : ProfileSection[] = [
    {
        id: "perfil",
        label: "Mi Perfil",
        icon: 'pi pi-user',
        component: ProfileSection
    }, 
    {
        id: "direccion",
        label: "Mis Direcciones",
        icon: "pi pi-map-marker",
        component: AddressSection
    }
] 

type profileSectionsProps = {
    perfil: ProfileSectionProps
    direccion: AddressSectionProps
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

export default function UserProfile() {

    const [activeSection, setActiveSection] = useState("perfil");
    const [editProfileVisible, setEditProfileVisible] = useState(false);
    const [addAddressVisible, setAddAddressVisible] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);

    const [ editForm, setEditForm ] = useState<Client>(initForm)
    const { data: userProfile, isSuccess } = useClient(1)

    const [addresses, setAddresses] = useState<Address[]>([
        {
            id: 1,
            label: "Casa",
            street: "Av. Libertador 1234, Depto 501",
            city: "La Serena",
            region: "Coquimbo",
            postalCode: "1700000",
            isDefault: true,
            commune: "La Serena",
            clientID: 0,
            number: ""
        },
        {
            id: 2,
            label: "Trabajo",
            street: "Calle Comercio 567",
            city: "La Serena",
            region: "Coquimbo",
            postalCode: "1700000",
            isDefault: false,
            clientID: 0,
            number: "",
            commune: ""
        }
    ]);

    const [newAddress, setNewAddress] = useState<Omit<Address, 'id'>>(initAddressForm);


    const handleEditProfile = () => {
        // setUserProfile(editForm);
        setEditProfileVisible(false);
    };

    const handleAddAddress = () => {
        if (editingAddress) {
            setAddresses(addresses.map(addr => 
                addr.id === editingAddress.id ? { ...newAddress, id: editingAddress.id } : addr
            ));
            setEditingAddress(null);
        } else {
            const newAddr: Address = {
                ...newAddress,
                id: -1
            };
            setAddresses([...addresses, newAddr]);
        }
        setNewAddress(initAddressForm);
        setAddAddressVisible(false);
    };

    const handleEditAddress = (address: Address) => {
        setEditingAddress(address);
        setNewAddress(address);
        setAddAddressVisible(true);
    };

    const handleDeleteAddress = (id: number) => {
        setAddresses(addresses.filter(addr => addr.id !== id));
    };

    const setDefaultAddress = (id: number) => {
        setAddresses(addresses.map(addr => ({
            ...addr,
            isDefault: addr.id === id
        })));
    };

    const Section = useMemo(() => profileSections.find((s) => s.id === activeSection )?.component, [activeSection])

    const sectionProps : profileSectionsProps = {
        perfil: {
            onClickEdit: () => {
                if(!userProfile) return

                setEditForm(userProfile);
                setEditProfileVisible(true);
            },
            userProfile: userProfile as Client
        },
        direccion: {
            handleAgregarDireccion: () => {
                setEditingAddress(null);
                setNewAddress(initAddressForm);
                setAddAddressVisible(true);
            },
            addresses: addresses,
            handleEditAddress: handleEditAddress,
            handleDeleteAddress: handleDeleteAddress,
            handleDefaultAddress: setDefaultAddress
        }
    }

  
    return (
        <div className="bg-gray-50 py-8 min-h-screen">
            <div className="container mx-auto px-4 max-w-7xl">
                <h1 className="text-3xl font-bold mb-8 text-gray-800">Centro Personal</h1>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                        <CardHeader 
                            userProfile={userProfile} 
                            memberSince={""} 
                            setActiveSection={setActiveSection} 
                            activeSection={activeSection} 
                            profileSections={profileSections}  
                            isLoading={(!Section && !isSuccess)}
                        />
                    </div>

                    <div className="lg:col-span-2">
                        {((Section && isSuccess)) ? <Section {...sectionProps[activeSection as keyof profileSectionsProps]} /> : <ProfileSectionSkeleton />}
                    </div>
                </div>
            </div>

            <EditProfileDialog 
                isOpen={editProfileVisible} 
                onClose={() => setEditProfileVisible(false)} 
                editForm={editForm} 
                handleSubmit={handleEditProfile}
                updateField={(field: keyof Client, value: string) => setEditForm(prev => ({ ...prev, [field]: value }))}            
            />
            <AddressPutDialog 
                title={editingAddress ? "Editar Dirección" : "Agregar Dirección"} 
                submitButtonMsg={editingAddress ? "Actualizar" : "Agregar"} 
                isOpen={addAddressVisible} 
                onClose={() => { setAddAddressVisible(false); setEditingAddress(null) }} 
                address={newAddress} 
                updateField={(field: keyof Address, value: Address[typeof field]) => setNewAddress(prev => ({...prev, [field]: value }))} 
                handleSubmit={handleAddAddress}            
            />
        </div>
    );
}