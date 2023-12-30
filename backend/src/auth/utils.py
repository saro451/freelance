"""Utilities functions for auth module"""

import random
import string
from uuid import uuid4

import jwt
from sqlmodel import exists

from src.config import settings
from src.database import create_org_tables
from src.database.main.database import db_main_session
from src.database.main.models import User


def email_exists(version: str, email: str) -> bool:
    """Check if email is already registered"""
    db = db_main_session(version)
    result = db.query(exists().where(User.email == email)).scalar()
    db.close()
    return result


def validate_credentials(version: str, email: str, password: str) -> bool | None:
    """Validate user credentials"""
    statement = exists().where(User.email == email, User.password == password)
    db = db_main_session(version)

    result = db.query(statement).scalar()
    db.close()

    return result


def create_jwt_token(payload: dict) -> str:
    """Create JWT token"""
    payload["jwti"] = uuid4().hex
    token = jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm="HS256")
    return token


def decode_jwt_token(token: str) -> dict:
    """Decode JWT token"""
    try:
        data = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=["HS256"])

        return data

    except jwt.PyJWTError:
        return None


def invalidate_jwt_token(token: str) -> None:
    """Invalidate JWT token"""
    pass


def create_login_token(version: str, email: str) -> str:
    """Create login token"""
    db = db_main_session(version)
    user = db.query(User).filter(User.email == email).first()

    # Create tables for the org
    create_org_tables(user.org_id)

    db.close()

    token_data = {
        "name": user.name,
        "email": user.email,
        "user_id": user.id,
        "org_id": user.org_id,
        "role": user.role,
        "token_type": "login",
    }

    return create_jwt_token(token_data)


def generate_random_string(length: int) -> str:
    """Generate random strings"""
    letters = string.ascii_letters + string.digits
    return "".join(random.choice(letters) for _ in range(length))
