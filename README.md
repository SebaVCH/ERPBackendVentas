# ERPBackendVentas
# Formate de la peticion POST de sale
{
    "id_cliente": 2,
    "direccion_envio": "Av. Siempre Viva 742",
    "forma_de_pago": "Tarjeta",
    "condiciones_de_pago": "Pago completo"
}

## CARRITO FUNCIONES
# agregar producto 

{
    "id_cliente": 2,
    "id_producto": 3,
    "cantidad": 5,
    "precio_unitario": 28.000
}

# eliminar producto

{
    "id_cliente": 2,
    "id_producto": 5,
    "cantidad": 33,
    "precio_unitario": 30.000
}

# Importante resaltar que las llamadas se manejan de la siguiente forma

type APIResponse struct {
	Success bool        `json:"success"`
	Message string      `json:"message,omitempty"`
	Error   string      `json:"error,omitempty"`
	Data    interface{} `json:"data,omitempty"`
}

# Crear direccion

{
    "id_cliente": 1,
    "direccion": "Armindo Gallardo Donoso 1636",
    "numero": 1636,
    "ciudad": "Coquimbo",
    "region": "Coquimbo",
    "comuna": "El bosque",
    "codigo_postal": "1700000",
    "etiqueta": "Casa"
}

## Integración Mercado Pago

Variables de entorno necesarias:

- `MP_ACCESS_TOKEN` : Token de acceso (Bearer) de Mercado Pago

Ejemplo de petición para crear checkout:

POST `/payments/checkout`

Body JSON:

{
    "id_cliente": 2,
    "amount": 12345.67,
    "title": "Compra ejemplo"
}

La respuesta contiene `init_point` para redirigir al checkout y `preference_id`.