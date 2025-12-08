import { useMemo, useState } from "react";
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import ProfileSection, { type ProfileSectionProps } from "./sections/ProfileSection";
import AddressSection, { type AddressSectionProps } from "./sections/AddressSection";
import { useClient, useClientAddress, useClientID } from "../../api/queries/useClients";
import CardHeader from "./components/CardHeader";
import { ProfileSectionSkeleton } from "./components/ProfileSectionSkeleton";
import OrderSection, { type OrderSectionProps } from "./sections/OrderSection";
import { ErrorState } from "../../components/ErrorState";

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
    },
    {
        id: "pedidos",
        label: "Mis Pedidos",
        icon: "pi pi-shopping-bag",
        component: OrderSection
    }
] 

type profileSectionsProps = {
    perfil: ProfileSectionProps
    direccion: AddressSectionProps
    pedidos: OrderSectionProps
}


export default function UserProfile() {

    const [activeSection, setActiveSection] = useState("perfil")

    const clientID  = useClientID() as number
    const { data: userProfile, isSuccess, isLoading, isError, error } = useClient(clientID)
    const { data: addresses } = useClientAddress(clientID)

    const Section = useMemo(() => profileSections.find((s) => s.id === activeSection )?.component, [activeSection])
    
    const sectionProps : profileSectionsProps = {
        perfil: {
            userProfile: userProfile,
            isLoading: isLoading
        },
        direccion: {
            addresses: addresses ?? [],
            clientID: clientID
        },
        pedidos: {
            clientID: clientID
        }
    }

    if(isError) {
        return (
            <ErrorState title={"Error al obtener los datos del perfil"} message={error.message} />
        )
    }

    return (
        <div className="bg-gray-50 py-8 min-h-screen">
            <div className="container mx-auto px-4 max-w-7xl">
                <h1 className="text-3xl font-bold mb-8 text-gray-800">Centro Personal</h1>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                        <CardHeader 
                            userProfile={userProfile} 
                            memberSince={(userProfile?.createdAt.getFullYear())?.toString() ?? "_undefined_"} 
                            setActiveSection={setActiveSection} 
                            activeSection={activeSection} 
                            profileSections={profileSections}  
                            isLoading={(!Section && !isSuccess)}
                        />
                    </div>

                    <div className="lg:col-span-2">
                        {((Section && isSuccess)) ? 
                            <Section {...sectionProps[activeSection as keyof profileSectionsProps]} /> 
                            :
                            <ProfileSectionSkeleton />}
                    </div>
                </div>
            </div>
        </div>
    );
}

