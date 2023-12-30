"""Database models for the mybusiness"""

from pydantic import EmailStr
from sqlmodel import Field, SQLModel

import src.mybusiness.types as MyBusinessType
from src.mybusiness.constants import MyBusinessConstant


class BusinessDetail(SQLModel, table=True):
    """Schema for the business details table"""

    __tablename__ = "business_details"

    id: int = Field(default=None, primary_key=True)
    org_name: str = Field(default=None)
    org_number: str = Field(default=None)
    address: str = Field(default=None)
    address2: str = Field(default=None)
    post_number: str = Field(default=None)
    location: str = Field(default=None)
    reference: str = Field(default=None)
    phone: str = Field(default=None)
    email: EmailStr = Field(default=None)
    account_number: str = Field(default=None)
    homepage: str = Field(default=None)


class StandardText(SQLModel, table=True):
    """Schema for the standard text table"""

    __tablename__ = "standard_texts"

    id: int = Field(default=None, primary_key=True)
    invoice: str = Field(default=None)
    remainder: str = Field(default=None)
    final_notice: str = Field(default=None)
    credit_note: str = Field(default=None)
    order_comfirmation: str = Field(default=None)
    pack_list: str = Field(default=None)
    offer: str = Field(default=None)
    english: str = Field(default=None)
    currency: str = Field(default=None)
    iban: str = Field(default=None)
    bic_swift: str = Field(default=None)
    country: str = Field(default=None)


class BusinessSetting(SQLModel, table=True):
    """Model for storing business general settings"""

    __tablename__ = "business_settings"

    id: int = Field(default=None, primary_key=True)
    price_including_vat: bool = Field(default=False)
    standard_vat_rate: int = Field(default=MyBusinessConstant.DEFAULT_VAT_RATE)
    payment_terms: int = Field(default=MyBusinessConstant.STANDARD_PAYMENT_TERMS)
    invoice_layout: MyBusinessType.InvoiceLayout = Field(
        default=MyBusinessType.InvoiceLayout.GIRO
    )
    use_rounding: bool = Field(default=False)
    use_customer_number: bool = Field(default=False)
    invoice_adjustment: MyBusinessType.InvoiceAdjustment = Field(
        default=MyBusinessType.InvoiceAdjustment.NEITHER
    )
    invoice_number_start: int = Field(default=MyBusinessConstant.INVOICE_START_NUMBER)
    use_logo: bool = Field(default=False)
    logo_position: MyBusinessType.LogoPosition = Field(
        default=MyBusinessType.LogoPosition.RIGHT
    )
    invoice_language: str = Field(default=MyBusinessConstant.DEFAULT_INVOICE_LANGUAGE)

    different_delivery_address: bool = Field(default=False)
    account_mode: MyBusinessType.AccountMode = Field(
        default=MyBusinessType.AccountMode.ORDINARY
    )
    different_delivery_date: bool = Field(default=False)
    multiuser_version: bool = Field(default=False)
    inventery_control: bool = Field(default=False)
    use_office_address: bool = Field(default=False)
    office_address_1: str = Field(default=None, max_length=30)
    office_address_2: str = Field(default=None, max_length=30)
    office_address_3: str = Field(default=None, max_length=30)
