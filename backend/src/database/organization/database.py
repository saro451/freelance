"""Organization database module"""

from fastapi import Request
from loguru import logger
from sqlalchemy import create_engine, engine
from sqlmodel import Session

from src.appglobals import g
from src.config import settings


def db_org_engine(request: Request = None, org_id: str = None) -> engine.Engine:
    """Database engine for organization db"""
    database = org_id if org_id else request.state.user.org_id

    global_db_attr = f"{database}_db_engine"
    global_db_engine = getattr(g, global_db_attr, None)

    # If engine is already available
    if global_db_engine:
        return global_db_engine

    logger.info(f"Creating database engine for {database}")
    DATABASE_URL = engine.url.URL(
        drivername="postgresql",
        username=settings.DB_USERNAME,
        password=settings.DB_PASSWORD,
        host=settings.DB_HOST,
        port=settings.DB_PORT,
        database=database,
    )

    db_engine = create_engine(DATABASE_URL, pool_size=0)
    setattr(g, global_db_attr, db_engine)

    return db_engine


def db_org(request: Request) -> Session:
    db_engine = db_org_engine(request)

    with Session(db_engine) as session:
        try:
            yield session
        finally:
            session.close()


def db_org_session(org_id: str) -> Session:
    db_engine = db_org_engine(org_id=org_id)

    with Session(db_engine) as session:
        try:
            return session
        finally:
            session.close()
