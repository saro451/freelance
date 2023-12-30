import requests
from loguru import logger

from src.config import settings

thread_mapping = {
    "user_signup": getattr(settings, "NEW_USER_THREAD"),
    "user_register": getattr(settings, "NEW_USER_THREAD"),
    "default": getattr(settings, "DEFAULT_THREAD"),
}


class TelegramNotification:
    def __init__(self):
        self.token = settings.TELEGRAM_TOKEN
        self.chat_id = settings.TELEGRAM_CHAT_ID

    def user_signup(self, user):
        """New user signed up"""
        text = """
        <b>New user signup for registration</b>\n
        Company Name: <code>{company_name}</code>
        Name: <code>{name}</code>
        Email: {email}
        Phone: <code>{phone}</code>
        Address: <code>{address}</code>
        Location: <code>{location}</code>
        """.format(
            company_name=user.org_name,
            name=user.name,
            email=user.email,
            address=user.address,
            phone=user.mobile,
            location=user.location,
        )

        return text

    def user_register(self, user):
        """New user registered successfully."""
        text = """
        <b>User successfully registered</b>\n
        Company Name: <code>{company_name}</code>
        Name: <code>{name}</code>
        Email: {email}
        Phone: <code>{phone}</code>
        Address: <code>{address}</code>
        Location: <code>{location}</code>
        """.format(
            company_name=user.org_name,
            name=user.name,
            email=user.email,
            address=user.address,
            phone=user.mobile,
            location=user.location,
        )

        return text

    def send_notification(self, type, data):
        """Send a message to a Telegram user or group specified on the constructor."""
        message = getattr(self, type)(data)
        url = f"https://api.telegram.org/bot{self.token}/sendMessage"
        thread_id = thread_mapping.get(type) or thread_mapping.get("default")
        params = {
            "chat_id": self.chat_id,
            "message_thread_id": thread_id,
            "text": message,
            "parse_mode": "HTML",
        }

        logger.info(f"Sending notification to Telegram: {params}")

        response = requests.get(url, params=params)
        logger.info(f"Telegram response: {response.json()}")


send_notification = TelegramNotification().send_notification
