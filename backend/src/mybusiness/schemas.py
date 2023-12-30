from pydantic import BaseModel, Field, validator

from src.appglobals import g
from src.auth.utils import email_exists, generate_random_string


class InviteUser(BaseModel):
    """Schema to invite new users on org"""

    name: str = Field(min_length=1, max_length=50)
    password: str | None = Field(
        default_factory=lambda: generate_random_string(8), min_length=8, max_length=128
    )
    email: str

    # Check if email already exists
    @validator("email")
    def check_email(cls, value):
        if email_exists(g.version, value):
            raise ValueError("email_already_exists")
        return value
