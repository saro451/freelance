import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from fastapi.templating import Jinja2Templates
from loguru import logger

from src.appglobals import g
from src.config import settings
from src.database.language.utils import get_language_dict

email_templates = Jinja2Templates(directory="../templates/emails")


class EmailAddress:
    def register():
        return settings.EMAIL.get(g.version).get("register")

    def changes():
        return settings.EMAIL.get(g.version).get("changes")

    def alerts():
        return settings.EMAIL.get(g.version).get("alerts")


address_mappings = {
    "user_register_alert": EmailAddress.register,
}


def get_email_address(email_type):
    """Get the correct email address according to version and type"""
    func = address_mappings.get(email_type)
    return func() if func else None


def send_raw_email(message, to="customer"):
    SMTP_SERVER = settings.SMTP.get(g.version).get("server")
    SMTP_PORT = settings.SMTP.get(g.version).get("port")
    SMTP_USERNAME = settings.SMTP.get(g.version).get(to).get("username")
    SMTP_PASSWORD = settings.SMTP.get(g.version).get(to).get("password")

    # Create a secure SSL/TLS connection with the SMTP server
    with smtplib.SMTP(
        SMTP_SERVER,
        SMTP_PORT,
    ) as server:
        server.starttls()

        server.login(
            SMTP_USERNAME,
            SMTP_PASSWORD,
        )

        server.send_message(message)

    logger.info("Email sent successfully to {}".format(message.get("TO")))


def send_email(mail_types, **kwargs):
    for mail_type in mail_types:
        to_admin = get_email_address(mail_type)
        to_email = to_admin or kwargs.get("email")

        # Check to send from admin or customer address
        from_email = (
            settings.SMTP.get(g.version)
            .get("admin" if to_admin else "customer")
            .get("address")
        )

        # Getting strings from database
        email_texts = get_language_dict(
            model="email_strings",
            locale=g.language,
            categorize=True,
        ).get(mail_type, {})

        logger.info(
            "Sending {} email to {} from {}.".format(
                mail_type,
                to_email,
                from_email,
            )
        )

        template_file = f"{mail_type}.html"

        msg = MIMEMultipart("alternative")
        msg["From"] = from_email
        msg["To"] = to_email
        msg["Subject"] = (
            kwargs.get("email_subject")
            if to_admin
            else email_texts.get("email_subject")
        )

        template = email_templates.get_template(template_file)
        html = template.render(data=kwargs, string=email_texts)

        msg.attach(MIMEText(html, "html"))

        send_raw_email(msg)
