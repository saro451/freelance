from src.appglobals import g
from src.config import Version
from src.database import db_main_session
from src.database.main.models import PrintoutLanguage


class Constant:
    STANDARD_PAYMENT_TERMS = 15

    @property
    def DEFAULT_VAT_RATE(self) -> int:
        """Returns the default vat rate"""
        if g.version == Version.NORWAY.value:
            return 25

        elif g.version == Version.SWEDEN.value:
            return 25

    @property
    def INVOICE_START_NUMBER(self) -> int:
        if g.version == Version.NORWAY.value:
            return 1001

        elif g.version == Version.SWEDEN.value:
            return 1

    @property
    def DEFAULT_INVOICE_LANGUAGE(self) -> str:
        db = db_main_session()

        return (
            db.query(PrintoutLanguage)
            .filter(PrintoutLanguage.is_default == True)
            .first()
        )


MyBusinessConstant = Constant()
