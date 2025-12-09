import { useState } from "react"
import { ProgressSpinner } from 'primereact/progressspinner';
import GenericDialog from "../../../components/Dialog";
        

type ConfirmationCheckoutDialogProps = {
    createCheckout: () => Promise<void>
    isOpen: boolean
    onClose: () => void
}

export default function ConfirmationCheckoutDialog({ isOpen, createCheckout, onClose } : ConfirmationCheckoutDialogProps) {
    

    const [ isRedirecting, setIsRedirecting ] = useState(false)

    const asyncCheckout = async () => {
        await createCheckout()
    }
    const handleCreateCheckout = () => {
        setIsRedirecting(true)
        setTimeout(async () => {
            await asyncCheckout()
        }, 500)
    }


    return (
        <GenericDialog 
            visible={isOpen} 
            onHide={onClose}     
            title="Confirmar pago"     
            onConfirm={handleCreateCheckout}
            footer={isRedirecting ? <></> : undefined}  
            closable={!isRedirecting}
        >
            { !isRedirecting ? 
                <div className="space-y-4">
                    <p>Dale a Confirmar para empezar la compra</p>
                </div>
                :
                <div className="flex flex-col items-center justify-center space-y-4">
                    <p className="text-lg font-semibold">Estás siendo redirigido</p>
                    <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
                </div>
            }
        </GenericDialog>
    )
};
