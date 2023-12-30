import uuid

from pydantic import condecimal, validator
from sqlmodel import Field, SQLModel


class Product(SQLModel, table=True):
    """Product model"""

    __tablename__ = "products"

    id: int = Field(default=None, primary_key=True)
    unique_id: str = Field(default_factory=lambda: uuid.uuid4().hex, unique=True)
    name: str = Field(index=True, nullable=False, max_length=50)
    price: condecimal(max_digits=10, decimal_places=2) = None
    in_price: condecimal(max_digits=10, decimal_places=2) = None
    description: str = Field(default=None, max_length=50)
    in_stock: int = Field(default=None, le=1000000000)
    unit: str = Field(default=None, max_length=15)
    article_number: str = Field(default=None, index=True, max_length=30)

    @validator("name")
    def invalid_name(cls, name):
        if not name.strip():
            raise ValueError("invalid_name")
        return name.strip()

    @validator("description", "unit")
    def strip_value(cls, value):
        if value:
            return value.strip()
