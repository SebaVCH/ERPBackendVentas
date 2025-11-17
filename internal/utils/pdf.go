package utils

import (
	"bytes"
	"fmt"
	"os"
	"strings"

	"github.com/SebastiaanKlippert/go-wkhtmltopdf"
)

func StartPDFEngine() error {
	wkhtmltopdf.SetPath(os.Getenv("WKHTMLTOPFD_PATH"))

	_, err := wkhtmltopdf.NewPDFGenerator()
	if err != nil {
		return fmt.Errorf("wkhtmltopdf error: %w", err)
	}
	return nil
}

func configureGlobal(pdfg *wkhtmltopdf.PDFGenerator) {
    pdfg.Dpi.Set(300)
	pdfg.Orientation.Set(wkhtmltopdf.OrientationLandscape)
	pdfg.Grayscale.Set(true)
}

func configureDefaultPage(page *wkhtmltopdf.PageReader) {
	page.FooterRight.Set("[page]")
	page.FooterFontSize.Set(10)
	page.Zoom.Set(0.95)
}



func GeneratePDFFromHTMLString(html string) ([]byte, error) {

	pdfg := wkhtmltopdf.NewPDFPreparer()
	page := wkhtmltopdf.NewPageReader(strings.NewReader(html))

	configureDefaultPage(page) 	

	pdfg.AddPage(page)	
	configureGlobal(pdfg)

	jsonBytes, err := pdfg.ToJSON()
	if err != nil {
		return nil, err
	} 

	pdfFromJSON, err := wkhtmltopdf.NewPDFGeneratorFromJSON(bytes.NewReader(jsonBytes))
	if err != nil {
		return nil, err 
	}

	if err := pdfFromJSON.Create(); err != nil {
		return nil, err 
	}

	return pdfFromJSON.Buffer().Bytes(), nil
} 

