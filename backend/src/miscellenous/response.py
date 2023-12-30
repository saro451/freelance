from typing import List

from pydantic import BaseModel, Field, validator

from src.database.main.models import Language


class Metadata(BaseModel):
    title: str | None
    description: str | None
    favicon: str | None


class Link(BaseModel):
    home: str = Field(default="/")
    order: str = Field(default="/order", alias="orders")
    our_customer: str = Field(default="/our-customer")
    about_us: str = Field(default="/about-us")
    contact_us: str = Field(default="/contact-us")

    @validator("*", pre=True, always=True)
    def set_default_if_none(cls, value, field):
        if value is None and field.default:
            return field.default
        return value


class ConfigResponse(BaseModel):
    version: str
    image: str | None
    logo: str | None
    languages: List[Language]
    links: Link
    metadata: Metadata
