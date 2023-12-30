from typing import Literal, Optional

from pydantic import BaseModel, Field


class UpdateLanguage(BaseModel):
    name: str = Field(min_length=3, max_length=25, default=None)
    is_default: Optional[Literal[True, None]] = None
    is_active: Optional[bool] = None
    is_premium: Optional[bool] = None
