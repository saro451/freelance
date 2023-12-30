from sqlmodel import SQLModel

import src.mybusiness.models as BusinessModel
import src.pricelist.models as PricelistModel

from ..main.database import db_main_session
from .database import db_org_engine


def create_org_tables(org_id: str) -> None:
    """Create tables in org database"""
    db_engine = db_org_engine(org_id=org_id)

    SQLModel.metadata.create_all(
        bind=db_engine,
        tables=[
            BusinessModel.BusinessDetail.__table__,
            BusinessModel.BusinessSetting.__table__,
            BusinessModel.StandardText.__table__,
            PricelistModel.Product.__table__,
        ],
    )


def create_org_database(version: str, org_id: str) -> None:
    """Creates a new database for the organization"""
    conn = db_main_session(version)
    conn.execute("COMMIT")
    conn.execute(f'CREATE DATABASE "{org_id}"')
    conn.close()

    create_org_tables(org_id)


def delete_org_database(version: str, org_id: str) -> None:
    """Deletes the database for the organization"""
    conn = db_main_session(version)
    conn.execute("COMMIT")
    conn.execute(f'DROP DATABASE IF EXISTS"{org_id}"')
    conn.close()
