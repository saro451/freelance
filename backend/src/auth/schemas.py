"""Pydatic schemas for auth modules"""

import re

from pydantic import BaseModel, EmailStr, Field, validator

from src.appglobals import g

from .utils import email_exists


class Email(BaseModel):
    """Schema for email"""

    email: EmailStr

    # Check if email already exists
    @validator("email")
    def check_email(cls, value):
        if email_exists(g.version, value):
            raise ValueError("email_already_exists")
        return value


class Password(BaseModel):
    """Schema for password"""

    password: str = Field(
        min_length=8,
        max_length=128,
    )


class CreateUserApi(BaseModel):
    """Schema for user creation from API for integration"""

    name: str = Field(min_length=1, max_length=50)
    email: EmailStr
    org_name: str = Field(min_length=1, max_length=50)
    org_number: str | None = Field(max_length=50)
    address: str = Field(min_length=1, max_length=50)
    location: str = Field(min_length=1, max_length=50)
    post_number: str = Field(min_length=1, max_length=20)
    mobile: str = Field(min_length=1, max_length=50)

    # Convert to lowercase
    @validator("email")
    def to_lowercase(cls, value):
        return value.lower()

    # Remove whitespace
    @validator("org_name", "org_number")
    def remove_whitespace(cls, value):
        return value.strip() if value else value

    @validator("post_number")
    def check_postnumber(cls, value):
        try:
            data = int(value.replace(" ", ""))
        except ValueError:
            raise ValueError("invalid_post_number")

        MAX_VALUE = 10000 if g.version == "norway" else 100000
        if not (100 <= data <= MAX_VALUE):
            raise ValueError("invalid_post_number")

        return value


class CreateUser(Password, CreateUserApi):
    """Schema for user creation"""

    # Check if email already exists
    @validator("email")
    def check_email(cls, value):
        if email_exists(g.version, value):
            raise ValueError("email_already_exists")
        return value


class SignupUserApi(Password):
    """Schema for signup user with API"""

    token: str


class VerifyUser(BaseModel):
    """Schema for email verification"""

    token: str


class LoginUser(BaseModel):
    """Schema for user login"""

    email: EmailStr
    password: str

    # Check if password is empty
    @validator("password")
    def check_password(cls, value):
        if not value:
            raise ValueError("password_required")
        return value


class ForgotPassword(BaseModel):
    """Schema for forgot password"""

    email: EmailStr

    # Check if email exists
    @validator("email")
    def check_email(cls, value):
        if not email_exists(g.version, value):
            raise ValueError("email_not_exists")
        return value
