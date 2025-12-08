import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import type { ReactNode } from "react";

interface GenericDialogProps {
    visible: boolean
    onHide: () => void
    title?: string
    children: ReactNode
    footer?: ReactNode
    showFooter?: boolean
    confirmLabel?: string
    cancelLabel?: string
    onConfirm?: () => void
    onCancel?: () => void
    confirmDisabled?: boolean
    confirmIcon?: string
    cancelIcon?: string
    confirmSeverity?: "success" | "info" | "warning" | "danger" | "help" | "secondary" | "contrast"
    width?: string
    closable?: boolean
    closeOnEscape?: boolean
    dismissableMask?: boolean
    headerClassName?: string
    contentClassName?: string
    footerClassName?: string
}

export default function GenericDialog({
    visible,
    onHide,
    title,
    children,
    footer,
    showFooter = true,
    confirmLabel = "Confirmar",
    cancelLabel = "Cancelar",
    onConfirm,
    onCancel,
    confirmDisabled = false,
    confirmIcon = "pi pi-check",
    cancelIcon = "pi pi-times",
    confirmSeverity = "contrast",
    width = "30rem",
    closable = true,
    closeOnEscape = true,
    dismissableMask = true,
    headerClassName = "",
    contentClassName = "",
    footerClassName = "",
}: GenericDialogProps) {
    
    const handleCancel = () => {
        if (onCancel) {
            onCancel()
        }
        onHide()
    }

    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm()
        }
    }

    const defaultFooter = (
        <div className={`flex justify-end gap-2 ${footerClassName}`}>
            <Button
                label={cancelLabel}
                icon={cancelIcon}
                onClick={handleCancel}
                severity="secondary"
                outlined
                className={footerClassName}
            />
            <Button
                label={confirmLabel}
                icon={confirmIcon}
                onClick={handleConfirm}
                severity={confirmSeverity}
                disabled={confirmDisabled}
                className={footerClassName}
            />
        </div>
    );

    return (
        <Dialog
            visible={visible}
            onHide={onHide}
            header={title}
            footer={showFooter ? (footer || defaultFooter) : null}
            style={{ width }}
            closable={closable}
            closeOnEscape={closeOnEscape}
            dismissableMask={dismissableMask}
            headerClassName={`bg-gradient-to-r from-slate-50 to-blue-50 border-b ${headerClassName}`}
            contentClassName={`bg-white ${contentClassName}`}
            draggable={false}
            resizable={false}
        >
            <div className="py-4">
                {children}
            </div>
        </Dialog>
    );
}