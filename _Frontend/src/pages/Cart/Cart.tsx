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

interface Product {
    id: number;
    code: string;
    name: string;
    description: string;
    image: string;
    price: number;
    quantity: number;
}

export default function Cart() {
    const [products, setProducts] = useState<Product[]>([
        {
            id: 1,
            code: "PROD-010",
            name: "Tarjeta Gráfica NVIDIA RTX 4060",
            description: "Laptop con procesador Intel i5, 8GB RAM, 256GB SSD",
            image: "https://foreign.cl/wp-content/uploads/2024/01/https___media-prod-use-1.mirakl.webp",
            price: 449990,
            quantity: 1,
        },
        {
            id: 2,
            code: "PROD-011",
            name: "Placa Madre ASUS TUF B550M-PLUS",
            description: "Mouse inalámbrico ergonómico de alta precisión",
            image: "https://m.media-amazon.com/images/I/81rgqqBI0FL._AC_SL1500_.jpg",
            price: 159990,
            quantity: 2,
        },
        {
            id: 3,
            code: "PROD-012",
            name: "Procesador AMD Ryzen 7 5800X",
            description: "Teclado mecánico con switches azules y retroiluminación RGB",
            image: "https://media.solotodo.com/media/products/1263671_picture_1672268365.jpg",
            price: 329990,
            quantity: 1
        }
    ]);

    const clientID = useClientID() as number
    const { data: cart, error, isLoading } = useCart(clientID)
    const { mutate: mutateAddItemCart, isPending: isLoadingAddItem } = useAddItemToCart()
    const { mutate: mutateChangeItemCart, isPending: isLoadingChangeItem } = useDeleteCartItem() 
    
    useEffect(() => {
        console.log(cart)
        console.log(error?.status)
    }, [cart, error])


    const increaseQuantity = (product : Product) => {
        mutateAddItemCart({
            productID: product.id,
            clientID: clientID,
            amount: 1,
            unitPrice: product.price
        })
    }


    const decreaseQuantity = (product : Product) => {
        mutateChangeItemCart({
            productID: product.id,
            clientID: clientID,
            amount: 1,
            unitPrice: product.price
        })
    };

    const removeProduct = (product : Product) => {
        mutateChangeItemCart({
            productID: product.id,
            clientID: clientID,
            amount: product.quantity,
            unitPrice: product.price
        })
    };

    const getTotalItems = () => {
        return products.reduce((sum, p) => sum + p.quantity, 0);
    };

    const getTotalPrice = () => {
        return products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    };

    const listTemplate = (items: Product[]) => {
        if (!items || items.length === 0) {
            return (
                <div className="text-center p-8">
                    <p className="text-xl text-gray-500">Tu carrito está vacío</p>
                </div>
            );
        }

        return (
            <div className="space-y-4">
                {items.map((product) => (
                    <div key={product.id} className="flex items-center gap-4 p-4 border rounded-lg bg-white shadow-sm">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-24 h-24 object-cover rounded"
                        />

                        <div className="flex-1">
                            <h3 className="text-lg font-semibold">{product.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                            <p className="text-xl font-bold text-blue-600 mt-2">
                                ${product.price}
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                icon="pi pi-minus"
                                rounded
                                outlined
                                severity="secondary"
                                onClick={() => decreaseQuantity(product)}
                                disabled={product.quantity <= 1}
                                size="small"
                            />
                            <span className="w-12 text-center font-semibold text-lg">
                                {product.quantity}
                            </span>
                            <Button
                                icon="pi pi-plus"
                                rounded
                                outlined
                                severity="secondary"
                                onClick={() => increaseQuantity(product)}
                                size="small"
                            />
                        </div>

                        <Button
                            icon="pi pi-trash"
                            rounded
                            outlined
                            severity="danger"
                            onClick={() => removeProduct(product)}
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
        const res = await createCheckout({
            clientID: clientID,
            addressID: 10,
            amount: getTotalPrice(),
            title: "e-commerce"
        })
        window.open(res.initPoint, '_self')
    }

    if(isLoading) return <LoadingState message={"Obteniendo Carrito"} />

    if(error && error.status == 404) {
        return <ErrorState title={"Carrito no encontrado"} message={"¡Vuelve al home para empezar a rellenar el carrito!"} />
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <h1 className="text-3xl font-bold mb-6">Tu carrito de compras</h1>
                    <div className="card">
                        <DataView value={products} listTemplate={listTemplate} />
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <h2 className="text-2xl font-bold mb-6">Resumen del pedido</h2>
                    <Card className="shadow-lg">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center pb-4 border-b">
                                <span className="text-gray-600">
                                    Productos ({getTotalItems()})
                                </span>
                                <span className="font-semibold">
                                    ${getTotalPrice()}
                                </span>
                            </div>

                            <div className="space-y-2">
                                {products.map(product => (
                                    <div key={product.id} className="flex justify-between text-sm">
                                        <span className="text-gray-600">
                                            {product.name} x{product.quantity}
                                        </span>
                                        <span>
                                            ${(product.price * product.quantity)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-4 border-t">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-semibold">
                                        ${getTotalPrice()}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-600">Envío</span>
                                    <span className="font-semibold text-green-600">Gratis (creo)</span>
                                </div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-600">IVA</span>
                                    <span className="font-semibold text-red-600">19%</span>
                                </div>
                                <div className="flex justify-between items-center text-xl font-bold pt-4 border-t">
                                    <span>Total</span>
                                    <span className="text-blue-600">
                                        ${(getTotalPrice() + getTotalPrice()*0.19).toFixed(0)}
                                    </span>
                                </div>
                            </div>

                            <Button
                                label="Proceder al pago"
                                icon="pi pi-shopping-cart"
                                className="w-full mt-4"
                                size="large"
                                disabled={products.length === 0}
                                onClick={() => setVisible(true)}
                            />
                        </div>
                    </Card>
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