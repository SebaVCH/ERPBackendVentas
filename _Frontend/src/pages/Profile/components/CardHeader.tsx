/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar } from "primereact/avatar";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import type { ProfileSection } from "..";
import { Skeleton } from "primereact/skeleton";
import type { Client } from "../../../types/Client";

type CardHeaderProps = {
    userProfile ?: Client
    memberSince : string
    setActiveSection : ( s : string ) => void 
    activeSection : string 
    profileSections : ProfileSection<any>[]
    isLoading ?: boolean
}




export default function CardHeader( {userProfile, memberSince, setActiveSection, activeSection, profileSections, isLoading } : CardHeaderProps ) {

    const isLodingAndUserProfile =  isLoading || !userProfile

    return (
        <Card className="shadow-lg">
            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    { isLodingAndUserProfile ? <Skeleton shape="circle" size="64px"></Skeleton> : <Avatar label={userProfile.firstName.charAt(0)} size='xlarge' shape="circle" /> }
                    <div>
                        { isLodingAndUserProfile ? <Skeleton width="10rem" className="mb-4"></Skeleton> : <h2 className="text-xl font-bold text-gray-800">{userProfile.firstName + " " + userProfile.lastName}</h2> }
                        { isLodingAndUserProfile ? <Skeleton width="5rem" className="mb-4"></Skeleton>  : <p className="text-sm text-gray-600">Miembro desde {memberSince}</p> }
                    </div>
                </div>
                <Divider />
                <div className="space-y-2">
                    {   isLodingAndUserProfile ?
                            <></>
                        :
                        profileSections.map((s) => (
                            <button 
                                key={s.id}
                                onClick={() => setActiveSection(s.id)} 
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeSection === s.id ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                            }`}>
                                <i className={s.icon}></i>
                                <span className="font-semibold">{s.label}</span>
                            </button>
                        ))
                    }
                </div>
            </div>
        </Card>
    )
};
