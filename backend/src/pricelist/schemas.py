from enum import Enum

from pydantic import BaseModel, Field

from src.database.main.models import PriceListMode

from .models import Product


class ChangePriceListMode(BaseModel):
    """Schema to change the advanced mode"""

    price_list_mode: PriceListMode = Field(alias="type")


class ProductSearchType(Enum):
    ALL = "all"
    ALPHABETICAL = "alphabetical"


class ProductOrderBy(Enum):
    NAME = "name"
    ARTICLE_NUMBER = "article_number"

    @classmethod
    def get(cls, value, mode):
        if mode != "full":
            return getattr(Product, cls.NAME.value)

        try:
            field = cls(value).value
        except ValueError:
            field = cls.NAME.value

        return getattr(Product, field)
