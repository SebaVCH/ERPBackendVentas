import { useAddressByID } from "../../../api/queries/useAddress";
import GenericDialog from "../../../components/Dialog";
import type { OrderDetail } from "../../../types/Order";

type OrderDetailDialogProps = {
    order: OrderDetail | null;
    isOpen: boolean;
    onClose: () => void;
};

export default function OrderDetailDialog({ order, isOpen, onClose }: OrderDetailDialogProps) {
    if (!order) return null;

    const { order: o } = order;

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { data: address, isLoading: addressLoading } = useAddressByID(o.AddressID);

    return (
        <GenericDialog
            visible={isOpen}
            onHide={onClose}
            title={`Detalles del Pedido #${o.id}`}
            showFooter={false}
            width="35rem"
        >
            <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">
                        Información del pedido
                    </h4>

                    <p className="text-sm text-gray-700">
                        <span className="font-semibold">Fecha:</span>{" "}
                        {new Date(o.orderDate).toLocaleDateString("es-ES", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </p>

                    <p className="text-sm text-gray-700">
                        <span className="font-semibold">Estado:</span>{" "}
                        <span className="capitalize">{o.state}</span>
                    </p>

                    <p className="text-sm text-gray-700">
                        <span className="font-semibold">Método de pago:</span>{" "}
                        {o.paymentMethod}
                    </p>

                    <p className="text-sm text-gray-700">
                        <span className="font-semibold">Términos de pago:</span>{" "}
                        {o.termsOfPayment}
                    </p>
                </div>
                {!addressLoading && address && (
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">
                            Dirección de envío
                        </h4>

                        <p className="text-sm text-gray-800 font-medium">
                            {address.label}
                        </p>

                        <p className="text-sm text-gray-700">
                            {address.street} {address.number}
                        </p>

                        <p className="text-sm text-gray-700">
                            {address.commune}, {address.city}
                        </p>

                        <p className="text-sm text-gray-700">
                            {address.region}, {address.postalCode}
                        </p>
                    </div>
                )}
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                        <span>Total</span>
                        <span>${o.total.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </GenericDialog>
    );
}
