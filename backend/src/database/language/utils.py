import json
import re
from collections import defaultdict

from fastapi import HTTPException, status
from loguru import logger
from sqlalchemy import column, select
from sqlalchemy.sql.expression import desc
from sqlmodel import SQLModel

from src.appglobals import g
from src.database import db_lang_session, db_main_session, db_redis_cache
from src.database.main.models import Language
from src.utils.misc import r2d_group_by, rows_to_list

from .models import BackendString, EmailString, PrintoutString, UIString, VersionString

lang_model_mapping = {
    UIString.__tablename__: UIString,
    BackendString.__tablename__: BackendString,
    EmailString.__tablename__: EmailString,
    PrintoutString.__tablename__: PrintoutString,
    VersionString.__tablename__: VersionString,
}


def get_lang_model(type: str, raise_exc: bool = False) -> SQLModel:
    model = lang_model_mapping.get(type)

    if not model and raise_exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="locale_not_found"
        )

    return model


def get_language_dict(model: str, locale: str, categorize: bool = False):
    """Get the language dictionary from database"""

    # Set default language as english
    locale = validate_language(locale)

    lang_model = get_lang_model(model, raise_exc=True)
    redis_key = f"{model}__{g.version}__{locale}"

    # Get from cache if exists
    data = db_redis_cache.get(redis_key)
    if data:
        return json.loads(data)

    logger.info(f"Getting language dictionary from database: {model}")

    session = db_lang_session()

    # Categorize the dictornary
    if categorize:
        st = select(column("category"), column("key"), column(locale)).select_from(
            lang_model
        )
        rows = session.execute(st).fetchall()

        data = defaultdict(dict)
        for category, key, value in rows:
            value = get_version_based_translation(value)
            data[category][key] = value

        # If common exits, add it in all category
        common_data = data.pop("common", None)
        if common_data:
            for key in data:
                for common_key, common_value in common_data.items():
                    data[key].setdefault(common_key, common_value)

    # No category
    else:
        st = select(column("key"), column(locale)).select_from(lang_model)
        rows = session.execute(st).fetchall()

        data = {}
        for row in rows:
            value = get_version_based_translation(row[locale])
            data[row["key"]] = value

    session.close()

    db_redis_cache.set(redis_key, json.dumps(data), ex=21600)

    return data


def get_version_based_translation(input_str: str):
    """Some language may have different varient according to version."""
    if not input_str:
        return None

    search_regex = r"\{\{(.*?)\}\}"
    replace_regex = r"\{\{.*?\}\}"
    matches = re.findall(search_regex, input_str)

    # If string don't have version based variations
    if not matches:
        return input_str

    # Get from cache if exists
    redis_key = f"{VersionString.__table__}"
    data = db_redis_cache.get(redis_key)

    if not data:
        session = db_lang_session()
        data = session.query(VersionString).all()
        data = r2d_group_by(data, "key")

        session.close()
        db_redis_cache.set(redis_key, json.dumps(data), ex=21600)
    else:
        data = json.loads(data)

    for match in matches:
        value = data.get(match, {}).get(g.version)
        if value:
            input_str = re.sub(replace_regex, value, input_str)

    return input_str


def validate_language(language: str) -> str:
    """Check if the language exists or not, return default language if not exists"""

    redis_key = f"language_pack__{g.version}"

    items = db_redis_cache.lrange(redis_key, 0, -1)

    if items:
        # If valid language
        if language in items:
            return language

        # If invalid language, return the default languaget
        return items[0]

    # If items not found on redis db
    db = db_main_session()
    items = db.query(Language.code).order_by(desc(Language.is_default)).all()
    items = rows_to_list(items)

    db_redis_cache.rpush(redis_key, *items)

    return language if language in items else items[0]
