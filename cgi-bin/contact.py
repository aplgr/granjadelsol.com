#!/usr/bin/env python3

import cgi
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

SMTP_SERVER = "w01e4fea.kasserver.com"
SMTP_PORT = 587 # TLS
SENDER_EMAIL = "paraguay@andreploeger.com"
SENDER_PASSWORD = "GRYWVV3wQtt6sQ4WrpkT"
RECEIVER_EMAIL = "mail@andreploeger.com"

print("Content-type: text/plain\n")

form = cgi.FieldStorage()
name = form.getvalue("name")
email = form.getvalue("email")
found = form.getvalue("foundby")
subject = form.getvalue("subject")
message = form.getvalue("message")

subject_int = "Immo-Verkauf: Kontaktformular"
body = f"Name: {name}\nEmail: {email}\nFound: {found}\n\nBetreff: {subject}\n\nNachricht: {message}"

def send_email(subject, body):
    msg = MIMEMultipart()
    msg['From'] = SENDER_EMAIL
    msg['To'] = RECEIVER_EMAIL
    msg['Subject'] = subject_int
    msg.attach(MIMEText(body, 'plain'))

    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.sendmail(SENDER_EMAIL, RECEIVER_EMAIL, msg.as_string())
            return "OK"
    except Exception as e:
        return f"NOK: {e}"

response = send_email(subject, body)

print(response)
