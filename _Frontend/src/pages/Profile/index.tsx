import { useMemo, useState } from "react";
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import ProfileSection, { type ProfileSectionProps } from "./sections/ProfileSection";
import AddressSection, { type AddressSectionProps } from "./sections/AddressSection";
import { useClient, useClientAddress } from "../../api/queries/useClients";
import CardHeader from "./components/CardHeader";
import { ProfileSectionSkeleton } from "./components/ProfileSectionSkeleton";
import OrderSection from "./sections/OrderSection";

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
}


export default function UserProfile() {

    const [activeSection, setActiveSection] = useState("perfil");
    
    const { data: userProfile, isSuccess, isLoading } = useClient(1)
    const { data: addresses } = useClientAddress(1)

    const Section = useMemo(() => profileSections.find((s) => s.id === activeSection )?.component, [activeSection])
    const sortedAddresses = useMemo(
        () =>
            addresses
                ? [...addresses].sort((a, b) =>
                    (a?.label ?? "").localeCompare(b?.label ?? "")
                )
                : [],
        [addresses]
    )

    const sectionProps : profileSectionsProps = {
        perfil: {
            userProfile: userProfile,
            isLoading: isLoading
        },
        direccion: {
            addresses: sortedAddresses,
            clientID: 1
        },
        
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

