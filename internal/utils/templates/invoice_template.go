package templates

import (
	"bytes"
	"text/template"
)

type Empresa struct {
	Nombre    string
	RUT       string
	Direccion string
	Giro      string
	Email     string
	Telefono  string
}

type Cliente struct {
	Nombre    string
	Telefono  string
	Direccion string
}

type Boleta struct {
	TipoDocumento string
	Numero        string
	FechaEmision  string
	TextoPie      string
}

type Item struct {
	Descripcion string
	Cantidad    int
	PrecioVenta string
	Total       string
}

type Resumen struct {
	Subtotal      string
	PorcentajeIVA int
	MontoIVA      string
	Total         string
}

type BoletaData struct {
	Empresa *Empresa
	Cliente *Cliente
	Boleta  *Boleta
	Items   []Item
	Resumen *Resumen
}

func InvoiceTemplateHTML(invoice BoletaData) (string, error) {

	HTMLLoad, err := template.ParseFiles(("internal/utils/templates/invoice_template.html"))
	if err != nil {
		return "", err
	}

	var body bytes.Buffer
	if err := HTMLLoad.Execute(&body, invoice); err != nil {
		return "", err
	}

	return body.String(), nil
}
