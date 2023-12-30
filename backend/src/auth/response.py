"""Response models for auth module"""

from datetime import date, timedelta

from pydantic import BaseModel, EmailStr, Field, validator

from src.database.main.models import AccountType, PriceListMode, Role
from src.utils.s3 import get_object_url, object_exists, s3


class UserConfigResponse(BaseModel):
    full_name: str = Field(alias="name")
    address: str
    user_id: str
    email: str
    role: Role
    org_name: str
    org_id: str
    allowed_users: int
    account_type: AccountType
    account_expiry: date
    advanced_mode: bool
    price_list_mode: PriceListMode
    show_warning: bool = Field(default=False)
    profile_pic: str = Field(default=None)

    @validator("show_warning", pre=True, always=True)
    def check_expiry_date(cls, value, values):
        account_type = values.get("account_type")

        # No warning on free accounts
        if account_type == AccountType.FREE:
            return False

        expiry_date = values.get("account_expiry")
        if expiry_date:
            today = date.today()
            if (expiry_date - today) < timedelta(days=10):
                return True
        return False

    @validator("profile_pic", pre=True, always=True)
    def set_profile_pic(cls, value, values):
        user_id = values.get("user_id")

        if object_exists("logo", user_id):
            return get_object_url("logo", user_id)

        return get_object_url("public", "icons/diamond.png")


class SignupApiResponse(BaseModel):
    url: str


class signupVerifyResponse(BaseModel):
    email: EmailStr


class TokenResponse(BaseModel):
    token: str
