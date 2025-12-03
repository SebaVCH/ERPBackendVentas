import { useMemo, useState } from "react";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Avatar } from "primereact/avatar";
import ProfileSection, { type ProfileSectionProps } from "./sections/ProfileSection";
import AddressPutDialog from "./components/AddressDialog";
import EditProfileDialog from "./components/EditProfileDialog";
import AddressSection, { type AddressSectionProps } from "./sections/AddressSection";


export interface UserProfile {
    name: string;
    email: string;
    phone: string;
    memberSince: string;
}

export interface Address {
    id: string;
    name: string;
    street: string;
    city: string;
    region: string;
    postalCode: string;
    phone: string;
    isDefault: boolean;
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ProfileSection<Props = any> = {
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

export default function UserProfile() {
    const [activeSection, setActiveSection] = useState("perfil");
    const [editProfileVisible, setEditProfileVisible] = useState(false);
    const [addAddressVisible, setAddAddressVisible] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);

    const [userProfile, setUserProfile] = useState<UserProfile>({
        name: "Juan Pérez",
        email: "juan.perez@email.com",
        phone: "+56 9 1234 5678",
        memberSince: "Enero 2024"
    });

    const [editForm, setEditForm] = useState(userProfile);

    const [addresses, setAddresses] = useState<Address[]>([
        {
            id: "1",
            name: "Casa",
            street: "Av. Libertador 1234, Depto 501",
            city: "La Serena",
            region: "Coquimbo",
            postalCode: "1700000",
            phone: "+56 9 1234 5678",
            isDefault: true
        },
        {
            id: "2",
            name: "Trabajo",
            street: "Calle Comercio 567",
            city: "La Serena",
            region: "Coquimbo",
            postalCode: "1700000",
            phone: "+56 9 8765 4321",
            isDefault: false
        }
    ]);

    const [newAddress, setNewAddress] = useState<Omit<Address, 'id'>>({
        name: "",
        street: "",
        city: "",
        region: "",
        postalCode: "",
        phone: "",
        isDefault: false
    });


    const handleEditProfile = () => {
        setUserProfile(editForm);
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
                id: Date.now().toString()
            };
            setAddresses([...addresses, newAddr]);
        }
        setNewAddress({
            name: "",
            street: "",
            city: "",
            region: "",
            postalCode: "",
            phone: "",
            isDefault: false
        });
        setAddAddressVisible(false);
    };

    const handleEditAddress = (address: Address) => {
        setEditingAddress(address);
        setNewAddress(address);
        setAddAddressVisible(true);
    };

    const handleDeleteAddress = (id: string) => {
        setAddresses(addresses.filter(addr => addr.id !== id));
    };

    const setDefaultAddress = (id: string) => {
        setAddresses(addresses.map(addr => ({
            ...addr,
            isDefault: addr.id === id
        })));
    };

    const Section = useMemo(() => profileSections.find((s) => s.id === activeSection )?.component, [activeSection])

    const sectionProps : profileSectionsProps = {
        perfil: {
            onClickEdit: () => {
                setEditForm(userProfile);
                setEditProfileVisible(true);
            },
            userProfile: userProfile
        },
        direccion: {
            handleAgregarDireccion: () => {
                setEditingAddress(null);
                setNewAddress({
                    name: "",
                    street: "",
                    city: "",
                    region: "",
                    postalCode: "",
                    phone: "",
                    isDefault: false
                });
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
                        <Card className="shadow-lg">
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <Avatar label={userProfile.name.charAt(0)} size='xlarge' shape="circle" /> 
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-800">{userProfile.name}</h2>
                                        <p className="text-sm text-gray-600">Miembro desde {userProfile.memberSince}</p>
                                    </div>
                                </div>
                                <Divider />
                                <div className="space-y-2">
                                    {profileSections.map((s) => (
                                        <button 
                                            key={s.id}
                                            onClick={() => setActiveSection(s.id)} 
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeSection === s.id ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                                        }`}>
                                            <i className={s.icon}></i>
                                            <span className="font-semibold">{s.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className="lg:col-span-2">
                        {Section && <Section {...sectionProps[activeSection as keyof profileSectionsProps]} />}
                    </div>
                </div>
            </div>

            <EditProfileDialog 
                isOpen={editProfileVisible} 
                onClose={() => setEditProfileVisible(false)} 
                editForm={editForm} 
                handleSubmit={handleEditProfile}
                updateField={(field: keyof UserProfile, value: string) => setEditForm(prev => ({ ...prev, [field]: value }))}            
            />
            <AddressPutDialog 
                title={editingAddress ? "Editar Dirección" : "Agregar Dirección"} 
                submitButtonMsg={editingAddress ? "Actualizar" : "Agregar"} 
                isOpen={addAddressVisible} 
                onClose={() => { setAddAddressVisible(false); setEditingAddress(null) }} 
                address={newAddress} 
                updateField={(field: keyof Address, value: string) => setNewAddress(prev => ({...prev, [field]: value }))} 
                handleSubmit={handleAddAddress}            
            />
        </div>
    );
}