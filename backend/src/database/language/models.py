from sqlmodel import Field, SQLModel


class UIString(SQLModel, table=True):
    """Schema for text strings"""

    __tablename__ = "ui_strings"

    key: str = Field(primary_key=True)
    category: str = Field(primary_key=True)


class BackendString(SQLModel, table=True):
    """Schema for error messages"""

    __tablename__ = "backend_strings"

    key: str = Field(primary_key=True)


class EmailString(SQLModel, table=True):
    """Schema for error messages"""

    __tablename__ = "email_strings"

    key: str = Field(primary_key=True)
    category: str = Field(primary_key=True)


class PrintoutString(SQLModel, table=True):
    """Model for printouts"""

    __tablename__ = "printouts_strings"

    key: str = Field(primary_key=True)
    category: str = Field(primary_key=True)


class VersionString(SQLModel, table=True):
    """Model for version based strings"""

    __tablename__ = "version_based_strings"

    key: str = Field(primary_key=True)
    norway: str = Field(nullable=True)
    sweden: str = Field(nullable=True)
