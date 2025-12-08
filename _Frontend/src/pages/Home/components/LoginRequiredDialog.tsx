import GenericDialog from "../../../components/Dialog";


type LoginRequiredDialogProps = {
    visible: boolean;
    onHide: () => void;
    onLogin: () => void;
};

export default function LoginRequiredDialog({ 
    visible, 
    onHide, 
    onLogin 
}: LoginRequiredDialogProps) {
    return (
        <GenericDialog
            visible={visible}
            onHide={onHide}
            title="Iniciar Sesión Requerido"
            confirmLabel="Iniciar Sesión"
            cancelLabel={`Continuar sin Iniciar Sesión`}
            onConfirm={onLogin}
            onCancel={onHide}
            confirmIcon="pi pi-sign-in"
            cancelIcon="pi pi-times"
            confirmSeverity="info"
            width="28rem"
            footerClassName="text-xs!"
        >
            <div className="flex flex-col gap-3">
                <div className="flex items-start gap-3">
                    <i className="pi pi-info-circle text-blue-500 text-2xl mt-1" />
                    <div className="flex-1">
                        <p className="text-gray-700 mb-3">
                            Debes iniciar sesión para agregar productos al carrito de compras.
                        </p>
                        <p className="text-gray-600 text-sm">
                            Si aún no tienes una cuenta, puedes registrarte de forma rápida y gratuita.
                        </p>
                    </div>
                </div>
            </div>
        </GenericDialog>
    );
}