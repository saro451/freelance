"""Database for language strings"""

from fastapi import Request
from sqlmodel import Session, SQLModel, create_engine

from src.config import settings
from src.database.utils import get_database_url

from .models import BackendString, EmailString, PrintoutString, UIString  # noqa

DATABASE_URL = get_database_url(settings.LANGUAGE_DB)

db_lang_engine = create_engine(DATABASE_URL)

SQLModel.metadata.create_all(
    bind=db_lang_engine,
)


# Database session for language db
def db_lang(request: Request) -> Session:
    with Session(db_lang_engine) as session:
        try:
            yield session
        finally:
            session.close()


def db_lang_session() -> Session:
    with Session(db_lang_engine) as session:
        try:
            return session
        finally:
            session.close()
