package usecase

import (
	"net/http"
	"strconv"
	"time"

	"github.com/SebaVCH/ERPBackendVentas/internal/domain"
	"github.com/SebaVCH/ERPBackendVentas/internal/repository"
	"github.com/SebaVCH/ERPBackendVentas/internal/utils"
	"github.com/SebaVCH/ERPBackendVentas/internal/utils/templates"
	"github.com/gin-gonic/gin"
)

func respondError(ctx *gin.Context, status int, err error, msg string) {
	respondJSON(ctx, status, APIResponse{
		Success: false,
		Message: msg,
		Error:   err.Error(),
	})
}

type CustomerUseCase interface {
	GetCustomers(c *gin.Context)
	GetCustomerByID(c *gin.Context) error
	SendEmail(c *gin.Context)
}

type customerUseCase struct {
	CustomerRepo repository.CustomerRepository
	SalesRepo    repository.SaleRepository
	CartRepo     repository.CartRepository
}

type SendEmailRequest struct {
	ClientID     int      `json:"id_cliente" binding:"required"`
	To           []string `json:"to" binding:"required"`
	Subject      string   `json:"subject" binding:"required"`
	BodyHTML     string   `json:"body" binding:"required"`
	BoletaVentas []int    `json:"boleta_ventas" binding:"required"`
}

func NewCustomerUseCase(customerRepo repository.CustomerRepository, salesRepo repository.SaleRepository, cartRepo repository.CartRepository) CustomerUseCase {
	return &customerUseCase{
		CustomerRepo: customerRepo,
		SalesRepo:    salesRepo,
		CartRepo:     cartRepo,
	}
}

func (cu customerUseCase) GetCustomers(c *gin.Context) {
	customers, err := cu.CustomerRepo.GetCustomers()
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Error al obtener los clientes"})
		return
	}

	for i := range customers {
		client := &customers[i]

		carts, _ := cu.CartRepo.GetCartsByClientID(client.IDCliente)
		sales, _ := cu.SalesRepo.GetSalesByClientID(client.IDCliente)

		client.Estado = cu.resolveEstado(carts, sales)
	}

	c.IndentedJSON(http.StatusOK, customers)
}

func (cu customerUseCase) GetCustomerByID(ctx *gin.Context) error {
	idStr := ctx.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		respondJSON(ctx, http.StatusBadRequest, APIResponse{
			Success: false,
			Message: "id_dirección inválido",
			Error:   "se requiere un id_numérico mayor a 0"})
		return err
	}
	client, err := cu.CustomerRepo.GetCustomerByID(id)
	if err != nil {
		respondJSON(ctx, http.StatusInternalServerError, APIResponse{
			Success: false,
			Message: "Error Interno al obtener el cliente",
			Error:   err.Error()})
		return err
	}

	respondJSON(ctx, http.StatusOK, APIResponse{
		Success: true,
		Message: "cliente obtenido correctamente",
		Data:    client,
	})

	return nil
}

func (cu customerUseCase) resolveEstado(carts []domain.Carrito, sales []domain.Venta) domain.EstadoCliente {
	switch {
	case cu.isClientePerdido(sales):
		return domain.EstadoClientePerdido
	case len(sales) > 1:
		return domain.EstadoClienteActivo
	case len(sales) == 1:
		return domain.EstadoClienteNuevo
	case len(carts) > 0:
		return domain.EstadoInteresado
	default:
		return domain.EstadoProspecto
	}
}

func (cu customerUseCase) isClientePerdido(sales []domain.Venta) bool {
	filterSales := utils.Filter(sales, func(s domain.Venta) bool {
		return s.FechaPedido.Year() > 2025
	})
	return len(filterSales) > 0
}

func (cu *customerUseCase) SendEmail(ctx *gin.Context) {
	var req SendEmailRequest

	if err := ctx.ShouldBindJSON(&req); err != nil {
		respondError(ctx, http.StatusBadRequest, err, "Request inválido")
		return
	}

	customer, err := cu.CustomerRepo.GetCustomerByID(req.ClientID)
	if err != nil {
		respondError(ctx, http.StatusInternalServerError, err, "error")
		return
	}

	empresa := &templates.Empresa{
		Nombre:    "COMERCIAL SI2 SPA",
		RUT:       "12.345.678-9",
		Direccion: "Av. Siempre Viva 1234 - Coquimbo",
		Giro:      "Servicio Retail",
		Email:     "erpventassi@gmail.com",
		Telefono:  "+56 9 1234 5678",
	}

	cliente := &templates.Cliente{
		Nombre:    customer.Nombre + " " + customer.Apellido,
		RUT:       customer.Telefono,
		Direccion: customer.Direccion,
	}

	var pdfBytes []utils.Attachment
	for _, idVenta := range req.BoletaVentas {
		boleta := &templates.Boleta{
			TipoDocumento: "BOLETA ELECTRÓNICO",
			Numero:        strconv.Itoa(idVenta),
			FechaEmision:  time.Now().Format("02/01/2006"),
			TextoPie:      "Documento generado automáticamente. \nNo requiere firma ni timbre.",
		}

		venta, err := cu.SalesRepo.GetSale(idVenta)
		if err != nil {
			respondError(ctx, http.StatusInternalServerError, err, "error")
			return
		}
		detallesVentas, err := cu.SalesRepo.GetSalesDetails(idVenta)

		if err != nil {
			respondError(ctx, http.StatusInternalServerError, err, "error")
			return
		}

		var items []templates.Item
		for _, detalle := range detallesVentas {
			item := templates.Item{
				Descripcion: detalle.Producto.Nombre,
				Cantidad:    detalle.Cantidad,
				PrecioVenta: strconv.FormatFloat(detalle.PrecioVenta, 'f', -1, 64),
				Total:       strconv.FormatFloat(detalle.PrecioVenta*(float64(detalle.Cantidad)), 'f', -1, 64),
			}
			items = append(items, item)
		}

		resumen := templates.Resumen{
			Subtotal:      strconv.FormatFloat(venta.Total, 'f', -1, 64),
			PorcentajeIVA: 19,
			MontoIVA:      strconv.FormatFloat(venta.Total*0.19, 'f', -1, 64),
			Total:         strconv.FormatFloat(venta.Total*1.19, 'f', -1, 64),
		}

		data := templates.BoletaData{
			Empresa: empresa,
			Cliente: cliente,
			Boleta:  boleta,
			Items:   items,
			Resumen: &resumen,
		}

		html, err := templates.InvoiceTemplateHTML(data)
		if err != nil {
			respondError(ctx, http.StatusInternalServerError, err, "error")
			return
		}

		pdfByte, err := utils.GeneratePDFFromHTMLString(html)
		if err != nil {
			respondError(ctx, http.StatusInternalServerError, err, "error")
			return
		}
		pdfBytes = append(pdfBytes, utils.Attachment{
			FileName:    "boleta N°" + strconv.Itoa(idVenta) + ".pdf",
			Buffer:      pdfByte,
			ContentType: "application/pdf",
		})
	}

	mail := &utils.Mail{
		To:          []string{customer.Email},
		Subject:     req.Subject,
		BodyHTML:    req.BodyHTML,
		Attachments: pdfBytes,
	}

	if err := utils.SendMail(mail); err != nil {
		respondError(ctx, http.StatusInternalServerError, err, "error")
		return
	}

	respondJSON(ctx, http.StatusOK, APIResponse{
		Success: true,
		Message: "corredo enviado",
	})
}
