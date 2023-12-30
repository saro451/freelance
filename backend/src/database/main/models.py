"""Models for main database"""
from datetime import datetime, timedelta
from enum import Enum
from uuid import uuid4

from pydantic import EmailStr, validator
from sqlmodel import Field, Relationship, SQLModel

from src.database.utils import validate_column_name


class Role(str, Enum):
    OWNER = "owner"
    USER = "user"


class AccountType(str, Enum):
    FREE = "free"
    PRO = "pro"


class PriceListMode(str, Enum):
    FULL = "full"
    UNIT = "unit"
    ORDINARY = "ordinary"


class User(SQLModel, table=True):
    """Schema for the user table"""

    __tablename__ = "users"

    id: str = Field(default_factory=lambda: uuid4().hex, primary_key=True, index=True)
    name: str = Field(min_length=3, max_length=50)
    email: EmailStr = Field(index=True, unique=True)
    password: str = Field(min_length=8, max_length=128, index=True)
    org_id: str = Field(foreign_key="organizations.id", index=True)
    join_date: datetime = Field(default_factory=datetime.utcnow)
    role: Role = Field(default=Role.OWNER)

    organization: "Organization" = Relationship(
        back_populates="users", sa_relationship_kwargs={"cascade": "delete"}
    )


class Organization(SQLModel, table=True):
    """Schema for the organization table"""

    __tablename__ = "organizations"

    id: str = Field(default_factory=lambda: uuid4().hex, primary_key=True, index=True)
    org_name: str = Field(index=True, max_length=50)
    org_number: str | None = Field(nullable=True, max_length=50)
    address: str = Field(max_length=50)
    post_number: str = Field(max_length=50)
    location: str = Field(max_length=50)
    mobile: str = Field(max_length=50)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    users: list["User"] = Relationship(back_populates="organization")
    settings: "OrgSetting" = Relationship(back_populates="organization")


class OrgSetting(SQLModel, table=True):
    """Schema for the settings table"""

    __tablename__ = "org_settings"

    org_id: str = Field(primary_key=True, foreign_key="organizations.id", index=True)
    allowed_users: int = Field(default=1)
    account_type: str = Field(default=AccountType.FREE)
    account_expiry: datetime = Field(
        default_factory=lambda: datetime.utcnow() + timedelta(days=14)
    )
    advanced_mode: bool = Field(default=False)
    price_list_mode: PriceListMode = Field(default=PriceListMode.ORDINARY)

    organization: "Organization" = Relationship(
        back_populates="settings", sa_relationship_kwargs={"cascade": "delete"}
    )


class Language(SQLModel, table=True):
    """Model for the ui languages"""

    __tablename__ = "ui_languages"

    id: int = Field(default=None, primary_key=True)
    name: str = Field(min_length=3, max_length=25, unique=True)
    code: str = Field(min_length=2, max_length=10, index=True, unique=True)
    icon: str = Field(default=None)
    is_default: bool = Field(default=False)
    is_active: bool = Field(default=False)
    is_premium: bool = Field(default=False)

    @validator("code")
    def check_code(cls, value):
        if not validate_column_name(value):
            raise ValueError("invalid_language_code")

        return value.lower()


class PrintoutLanguage(SQLModel, table=True):
    """Model for invoice languages"""

    __tablename__ = "printout_languages"

    id: int = Field(default=None, primary_key=True)
    name: str = Field(min_length=3, max_length=25, unique=True)
    code: str = Field(min_length=2, max_length=10, index=True, unique=True)
    icon: str = Field(default=None)
    is_default: bool = Field(default=False)
    is_active: bool = Field(default=False)
    is_premium: bool = Field(default=False)

    @validator("code")
    def check_code(cls, value):
        if not validate_column_name(value):
            raise ValueError("invalid_language_code")

        return value.lower()


class AppConfig(SQLModel, table=True):
    """Model for app configuration"""

    __tablename__ = "app_configs"

    id: int = Field(default=None, primary_key=True)
    image: str = Field(default=None)
    logo: str = Field(default=None)
    home: str = Field(default=None)
    orders: str = Field(default=None, alias="order")
    our_customer: str = Field(default=None)
    about_us: str = Field(default=None)
    contact_us: str = Field(default=None)


class UserLog(SQLModel, table=True):
    """Model for storing user logs"""

    __tablename__ = "user_logs"

    id: int = Field(default=None, primary_key=True)
    log_type: str = Field(max_length=50)
    user_id: str = Field(max_length=50)
    data: str = Field(default=None)
    date: datetime = Field(default_factory=datetime.utcnow)


class Admin(SQLModel, table=True):
    """Model for admins"""

    __tablename__ = "admins"

    id: int = Field(default=None, primary_key=True)
    user_id: str = Field(default=None)
    org_id: str = Field(default=None)
    date: datetime = Field(default_factory=datetime.utcnow)
