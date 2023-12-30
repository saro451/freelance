from enum import Enum


class InvoiceLayout(Enum):
    GIRO = "giro"
    MODERN = "modern"
    PDF = "pdf"


class InvoiceAdjustment(Enum):
    NEITHER = "neither"
    REBATE = "rebate"
    MARKUP = "markup"


class LogoPosition(Enum):
    LEFT = "left"
    RIGHT = "right"


class AccountMode(str, Enum):
    FULL = "full"
    UNIT = "unit"
    ORDINARY = "ordinary"
