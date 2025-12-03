import  { Card } from "primereact/card";
import  { Divider } from "primereact/divider";
import  { Skeleton } from "primereact/skeleton";

export function ProfileSectionSkeleton() {
    return (
        <Card className="shadow-lg">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Mi Perfil</h2>
                <Skeleton height="49px" width="100px"></Skeleton>
            </div>
            <div className="space-y-4">
                <div>
                    <label className="text-sm text-gray-600">Nombre completo</label>
                    <Skeleton height="28px"  width="10rem"></Skeleton>
                </div>
                <Divider />
                <div>
                    <label className="text-sm text-gray-600">Correo electrónico</label>
                    <Skeleton height="28px" width="20rem"></Skeleton>
                </div>
                <Divider />
                <div>
                    <label className="text-sm text-gray-600">Teléfono</label>
                    <Skeleton height="28px"  width="10rem"></Skeleton>
                </div>
            </div>
        </Card> 
    )
};

