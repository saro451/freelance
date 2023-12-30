import re

from sqlalchemy import engine
from sqlmodel import Session

from src.config import settings


def get_database_url(database: str):
    """Get database url for a database"""
    DATABASE_URL = engine.url.URL(
        drivername="postgresql",
        username=settings.DB_USERNAME,
        password=settings.DB_PASSWORD,
        host=settings.DB_HOST,
        port=settings.DB_PORT,
        database=database,
    )

    return DATABASE_URL


def execute_raw_query(
    db_session: Session, query: str, database: str | None = None
) -> None:
    """Execute a RAW SQL query on a database"""
    conn = db_session(database) if database else db_session()
    conn.execute("COMMIT")
    conn.execute(query)
    conn.close()


def validate_column_name(column: str) -> bool:
    """Check if a column name is valid for sql or not"""
    pattern = r"^[a-zA-Z_]+$"
    return bool(re.match(pattern, column))
