# ERPBackendVentas

# Dependencias del Proyecto

### WKHTHMLTOPDF 
- wkhtmltopdf https://wkhtmltopdf.org/
- En el .env agregar: WKHTMLTOPFD_PATH=<directorio_del_ejecutable> (ej: "C:/Program Files/wkhtmltopdf/bin/wkhtmltopdf.exe")



# Formate de la peticion POST de sale
{
    "id_cliente":1,
    "id_direccion":1,
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
Ejecutar comando go get github.com/mercadopago/sdk-go@latest en caso de que no funcione

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
# Importante para el flujo de venta

- PRIMERO SE MANEJA EL CARRITO CON NORMALIDAD
- AL DARLE EN COMPRAR O EN PAGAR EL LOS PRODUCTOS DE DICHO CARRITO PASAN A RESERVA
    /cart/reserve
- SI PASAN 5 MINUTOS Y LA COMPRA NO SE FECTUA SE CAE DICHA COMPRA Y LA RESERVA SE ELIMINA.
- PERO SI SE EFECTUA LA COMPRA CON NORMALIDAD DENTRO DEL TIEMPO, SE GENERA LA VENTA SE DESCUENTA DEL STOCK LOS PRODUCTO Y LA RESERVA SE ELIMINA.
    /sales

 ## Autenticación JWT 

    Endpoints añadidos:
    - `POST /auth/register` : 
    - `POST /auth/login` : 

    Request `register`:
    {
        "cliente_id": 1,        // opcional: vincular a cliente existente
        "nombre": "Juan",
        "apellido": "Perez",
        "email": "juan@example.com",
        "password": "secret123"
    }
    ```

    Request `login`:

    {
        "email": "juan@example.com",
        "password": "secret123"
    }


    Variables de entorno nuevas:

    - `JWT_SECRET` : secreto para firmar tokens JWT
    - `JWT_EXPIRY_MINUTES` : expiración del token en minutos (ej. 1440 = 24h)
