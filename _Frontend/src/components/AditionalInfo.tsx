import type { ReactNode } from "react";

interface AdditionalInfoProps {
    title: string
    message: string
    icon: string
    children?: ReactNode
}

export function AdditionalInfo({ title, message, icon, children }: AdditionalInfoProps) {
    return (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-gray-300">
            <div className="flex items-start gap-3">
                <i className={`pi ${icon} text-blue-600 mt-1`}></i>
                <div className="text-sm text-gray-600">
                    <p className="font-semibold text-gray-800 mb-1">{title}</p>
                    <p className="text-gray-600">{message}</p>
                    {children}
                </div>
            </div>
        </div>
    );
}