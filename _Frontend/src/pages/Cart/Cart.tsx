import { useEffect, useState } from "react";
import { DataView } from "primereact/dataview";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { createCheckout } from "../../api/services/payment.service";
import { useClientID } from "../../api/queries/useClients";
import { useAddItemToCart, useCart, useDeleteCartItem } from "../../api/queries/useCart";
import { ErrorState } from "../../components/ErrorState";
import { LoadingState } from "../../components/LoadingState";
import ConfirmationCheckoutDialog from "./components/ConfirmationCheckoutDialog";
import type { CartItem } from "../../types/Cart";
import AddressSelector from "./components/AddressSelector";
import type { Address } from "../../types/Address";


export default function Cart() {
    

    const clientID = useClientID() as number
    const { data: cart, error, isLoading } = useCart(clientID)
    const { mutate: mutateAddItemCart, isPending: isLoadingAddItem } = useAddItemToCart()
    const { mutate: mutateChangeItemCart, isPending: isLoadingChangeItem } = useDeleteCartItem() 
    const productItems = cart?.cartProducts ?? []
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)
    
    useEffect(() => {
        console.log(clientID)
        console.log(cart)
        console.log(error?.status)
    }, [cart, error, clientID])


    const increaseQuantity = (cartItem : CartItem) => {
        mutateAddItemCart({...cartItem, amount: 1, clientID})
    }

    const decreaseQuantity = (cartItem : CartItem) => {
        mutateChangeItemCart({...cartItem, amount: 1, clientID})
    };

    const removeProduct = (cartItem : CartItem) => {
        mutateChangeItemCart({...cartItem, clientID})
    };

    const getTotalItems = () => {
        return productItems.reduce((sum, p) => sum + p.amount, 0);
    };

    const getTotalPrice = () => {
        return Math.round(productItems.reduce((sum, p) => sum + (p.unitPrice * p.amount), 0));
    }

    const listTemplate = (items: CartItem[]) => {
        if (!items || items.length === 0) {
            return (
                <div className="text-center p-8">
                    <p className="text-xl text-gray-500">Tu carrito está vacío</p>
                </div>
            );
        }

        return (
            <div className="space-y-4">
                {items.map((itemCart) => (
                    <div key={itemCart.productID} className="flex items-center gap-4 p-4 border rounded-lg bg-white shadow-sm">
                        <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                            <i className="pi pi-box text-gray-400 text-3xl!"></i>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold">{itemCart.product.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">{itemCart.product.description}</p>
                            <p className="text-xl font-bold text-blue-600 mt-2">
                                ${itemCart.unitPrice.toLocaleString("es-CL")}
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                icon="pi pi-minus"
                                rounded
                                outlined
                                severity="secondary"
                                onClick={() => decreaseQuantity(itemCart)}
                                disabled={itemCart.amount <= 1}
                                size="small"
                            />
                            <span className="w-12 text-center font-semibold text-lg">
                                {itemCart.amount}
                            </span>
                            <Button
                                icon="pi pi-plus"
                                rounded
                                outlined
                                severity="secondary"
                                onClick={() => increaseQuantity(itemCart)}
                                size="small"
                            />
                        </div>

                        <Button
                            icon="pi pi-trash"
                            rounded
                            outlined
                            severity="danger"
                            onClick={() => removeProduct(itemCart)}
                            tooltip="Eliminar producto"
                            tooltipOptions={{ position: 'top' }}
                        />
                    </div>
                ))}
            </div>
        );
    };

    const [ visible, setVisible ] = useState(false)

    const handleCreateCheckout = async () => {
        if(!selectedAddress || !selectedAddress.id) {
            throw Error("DIRECCION_INVALIDA")
        }
        if(!clientID) {
            throw Error("CLIENT_ID_INVALIDO") 
        }
        const res = await createCheckout({
            clientID: clientID,
            addressID: selectedAddress.id,
            amount: getTotalPrice(),
            title: "e-commerce"
        })
        window.open(res.initPoint, '_self')
    }

    if(isLoading || isLoadingAddItem || isLoadingChangeItem) return <LoadingState message={"Obteniendo Carrito"} />

    if(error && error.status == 404) {
        return <ErrorState title={"Carrito no encontrado"} message={"¡Vuelve al home para empezar a rellenar el carrito!"} />
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <h1 className="text-3xl font-bold mb-6">Tu carrito de compras</h1>
                    <div className="card">
                        <DataView value={productItems} listTemplate={listTemplate} />
                    </div>
                </div>
                <div>
                    <AddressSelector clientID={clientID} onAddressSelect={(address) => setSelectedAddress(address)} />
                    <div className="lg:col-span-1">
                        <h2 className="text-2xl font-bold mb-6">Resumen del pedido</h2>
                        <Card className="shadow-lg">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center pb-4 border-b">
                                    <span className="text-gray-600">
                                        Productos ({getTotalItems()})
                                    </span>
                                    <span className="font-semibold">
                                        ${getTotalPrice().toLocaleString("es-CL")   }
                                    </span>
                                </div>

                                <div className="space-y-2">
                                    {productItems.map(itemCart => (
                                        <div key={itemCart.productID} className="flex justify-between text-sm">
                                            <span className="text-gray-600">
                                                {itemCart.product.name} x{itemCart.amount}
                                            </span>
                                            <span>
                                                ${(itemCart.unitPrice * itemCart.amount).toLocaleString("es-CL")}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-4 border-t">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-semibold">
                                            ${getTotalPrice().toLocaleString("es-CL")}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-600">Envío</span>
                                        <span className="font-semibold text-green-600">Gratis</span>
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-600">IVA <span className="font-semibold text-red-600">(19%)</span></span>
                                        <span className="font-semibold">
                                            ${(getTotalPrice()*0.19).toLocaleString("es-CL")}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-xl font-bold pt-4 border-t">
                                        <span>Total</span>
                                        <span className="text-blue-600">
                                            ${((getTotalPrice() + getTotalPrice()*0.19)).toLocaleString("es-CL")}
                                        </span>
                                    </div>
                                </div>

                                <Button
                                    label="Proceder al pago"
                                    icon="pi pi-shopping-cart"
                                    className="w-full mt-4"
                                    size="large"
                                    disabled={productItems.length === 0}
                                    onClick={() => setVisible(true)}
                                />
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
            <ConfirmationCheckoutDialog 
                createCheckout={handleCreateCheckout} 
                isOpen={visible} 
                onClose={() => setVisible(false)}                
            />
        </div>
    );
}