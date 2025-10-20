# ERPBackendVentas
# Formate de la peticion POST de sale
    {
        "id_cliente": 5,
        "id_empleado": 2,
        "fecha_pedido": "2025-10-20T12:00:00Z",
        "forma_de_pago": "Tarjeta",
        "condiciones_de_pago": "Contado",
        "detalles_venta": [
            { "id_producto": 10, "cantidad": 2, "precio_unitario": 15.5 },
            { "id_producto": 3,  "cantidad": 1, "precio_unitario": 100.0 }
        ]
    }