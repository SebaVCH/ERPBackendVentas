interface InfoCardProps {
    icon: string;
    label: string;
    value: string;
    iconColor?: string;
    iconBgColor?: string;
    valueColor?: string;
}

export function InfoCard({ 
    icon, 
    label, 
    value, 
    iconColor = "text-blue-600",
    iconBgColor = "bg-blue-100",
    valueColor = "text-gray-800"
}: InfoCardProps) {
    return (
        <div className="flex items-center gap-3">
            <div className={`w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center`}>
                <i className={`pi ${icon} ${iconColor} text-xl`}></i>
            </div>
            <div>
                <p className="text-sm text-gray-600">{label}</p>
                <p className={`font-bold ${valueColor}`}>{value}</p>
            </div>
        </div>
    );
}