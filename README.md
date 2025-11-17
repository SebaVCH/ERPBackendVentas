# ERPBackendVentas

# Dependencias del Proyecto

### WKHTHMLTOPDF 
- wkhtmltopdf https://wkhtmltopdf.org/
- En el .env agregar: WKHTMLTOPFD_PATH=<directorio_del_ejecutable> (ej: "C:/Program Files/wkhtmltopdf/bin/wkhtmltopdf.exe")



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