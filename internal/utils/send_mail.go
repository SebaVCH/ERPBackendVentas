package utils

import (
	"io"
	"os"
	"strconv"

	"gopkg.in/gomail.v2"
)


type Attachment  struct {
	FileName string
	Buffer []byte 
	ContentType string
}

type Mail struct {
	To []string
	Subject string
	BodyHTML string
	Attachments  []Attachment 
}


func SendMail(mail *Mail) error {

	newGomail :=  gomail.NewMessage()

	newGomail.SetHeader("From", os.Getenv("EMAIL_FROM"))
	newGomail.SetHeader("To", mail.To...)
	newGomail.SetHeader("Subject", mail.Subject)
	newGomail.SetBody("text/html", mail.BodyHTML)

	portStr := os.Getenv("SMTP_PORT")
	port, err := strconv.Atoi(portStr) 
	if err != nil {
		return err 
	}

	for _, attachment := range mail.Attachments {
		newGomail.Attach(attachment.FileName, gomail.SetCopyFunc(func(w io.Writer) error {
			_, err = w.Write(attachment.Buffer)
			return err
		}))
	} 
	if err != nil {
		return err
	}

	dialer := gomail.NewDialer(os.Getenv("SMTP_HOST"), port, os.Getenv("EMAIL_FROM"), os.Getenv("EMAIL_PASS"))
	return dialer.DialAndSend(newGomail)
} 