from pydantic import BaseModel, Field


class Success(BaseModel):
    success: bool = Field(default=True, const=True)
    status: str = Field(default="success")
    message: str = None


class Error(BaseModel):
    error: str
    message: str = None
    detail: dict = {}
    debug: list = []
