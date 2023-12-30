"""Main database module"""
from fastapi import Request
from loguru import logger
from sqlalchemy import create_engine, engine
from sqlmodel import Session

from src.appglobals import g

from ..utils import get_database_url


def db_main_engine(request: Request = None, version: str = None) -> engine.Engine:
    """Database engine for main db"""
    database = version if version else request.state.version

    global_db_attr = f"{database}_db_engine"
    global_db_engine = getattr(g, global_db_attr, None)

    # If engine is already available
    if global_db_engine:
        return global_db_engine

    logger.info(f"Creating database engine for {database}")

    DATABASE_URL = get_database_url(database)

    db_engine = create_engine(DATABASE_URL)
    setattr(g, global_db_attr, db_engine)

    return db_engine


def db_main(request: Request) -> Session:
    db_engine = db_main_engine(request)

    with Session(db_engine) as session:
        try:
            yield session
        finally:
            session.close()


def db_main_session(version: str = None) -> Session:
    version = version or g.version
    db_engine = db_main_engine(version=version)

    with Session(db_engine) as session:
        try:
            return session
        finally:
            session.close()
