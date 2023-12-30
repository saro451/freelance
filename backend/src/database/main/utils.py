from loguru import logger
from sqlmodel import SQLModel

from .database import db_main_engine
from .models import (  # noqa
    Admin,
    AppConfig,
    Language,
    Organization,
    OrgSetting,
    PrintoutLanguage,
    User,
    UserLog,
)


def create_main_tables(version: str) -> None:
    """Create tables in main database"""
    db_engine = db_main_engine(version=version)

    logger.info(f"Creating metadata in {db_engine}")

    SQLModel.metadata.create_all(
        db_engine,
        tables=[
            AppConfig.__table__,
            Language.__table__,
            PrintoutLanguage.__table__,
            Organization.__table__,
            OrgSetting.__table__,
            User.__table__,
            UserLog.__table__,
            Admin.__table__,
        ],
    )
