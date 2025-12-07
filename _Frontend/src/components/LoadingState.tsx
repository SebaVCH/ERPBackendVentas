import { ProgressSpinner } from "primereact/progressspinner";



interface LoadingStateProps {
    message: string
}

export function LoadingState({ message } : LoadingStateProps) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 via-gray-200 to-gray-50">
            <div className="text-center">
                <ProgressSpinner 
                    style={{ width: '60px', height: '60px' }}
                    strokeWidth="4"
                    animationDuration="1s"
                />
                <p className="mt-6 text-gray-600 text-lg font-medium">
                    {message}
                </p>
                <p className="mt-2 text-gray-500 text-sm">
                    Por favor espera un momento...
                </p>
            </div>
        </div>
    );
}