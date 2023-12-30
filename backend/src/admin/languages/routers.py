from typing import Optional

import pandas as pd
from fastapi import APIRouter, Depends, HTTPException, UploadFile, status
from fastapi.responses import FileResponse
from loguru import logger
from sqlalchemy import select, text, update
from sqlalchemy.exc import SQLAlchemyError
from sqlmodel import Session, exists, or_

from src.database import db_lang, db_lang_engine, db_lang_session, db_main
from src.database.language.models import PrintoutString, VersionString
from src.database.language.utils import get_lang_model, lang_model_mapping
from src.database.main.models import Language, PrintoutLanguage
from src.database.utils import execute_raw_query, validate_column_name
from src.utils.constants import ALLOWED_IMG_TYPE
from src.utils.misc import pd_read, result_to_dict, transform_locale_rows
from src.utils.response import Success
from src.utils.s3 import add_object_to_s3, s3

from .schema import UpdateLanguage
from .types import LanguageType
from .utils import check_header_match, get_language_order_start, merge_dataframe

router = APIRouter()


@router.get("/language/models", description="Get a list of language models used")
def get_language_models():
    return {"models": list(lang_model_mapping.keys())}


@router.get(
    "/language/{lang_type}",
    description="Get language details",
    response_model=list[Language | LanguageType],
)
def get_language(
    lang_type: LanguageType,
    db: Session = Depends(db_main),
):
    model = Language if lang_type == LanguageType.UI else PrintoutLanguage
    return db.query(model).order_by(model.id).all()


@router.post("/language/{lang_type}", description="Add a new language")
def add_language(
    lang_type: LanguageType,
    language: Language,
    db: Session = Depends(db_main),
):
    model = Language if lang_type == LanguageType.UI else PrintoutLanguage
    if db.query(
        exists().where(or_(model.code == language.code, model.name == language.name))
    ).scalar():
        raise HTTPException(
            status_code=status.HTTP_406_NOT_ACCEPTABLE, detail="lang_already_exists"
        )

    # Remove the value if set
    language.id = None
    language.is_active = None
    language.is_default = None

    # Add language on respective version
    data = model(**language.dict(exclude_unset=True))
    db.add(data)
    db.commit()

    if lang_type == LanguageType.UI:
        tables = [PrintoutLanguage.__tablename__]

    else:
        tables = lang_model_mapping.keys()
        tables.remove(VersionString.__tablename__)
        tables.remove(PrintoutString.__tablename__)

    # Add language fields if not exists
    for table_name in tables:
        query = (
            f"ALTER TABLE {table_name} ADD COLUMN IF NOT EXISTS {language.code} TEXT"
        )

        execute_raw_query(db_lang_session, query)

    return Success()


@router.delete("/language/{lang_type}", description="Delete UI or printout language")
def delete_language(lang_type: LanguageType, language_code: str):
    response = {
        "status_code": "no_allowed",
        "message": "Deleting language is not allowed.",
    }
    raise HTTPException(status_code=status.HTTP_426_UPGRADE_REQUIRED, detail=response)


@router.patch("/language/{lang_type}", description="Update language details")
def update_language(
    lang_type: LanguageType,
    language_code: str,
    data: UpdateLanguage,
    db: Session = Depends(db_main),
):
    model = Language if lang_type == LanguageType.UI else PrintoutLanguage

    data = data.dict(exclude_unset=True)
    if not data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="no_data_supplied"
        )

    language = db.query(model).filter(model.code == language_code)

    if not language:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="language_not_found"
        )

    # If is_active=False, and the language is default
    if not data.get("is_active", True) and language.first().is_default:
        raise HTTPException(
            status_code=status.HTTP_412_PRECONDITION_FAILED,
            detail="cant_delete_default_language",
        )

    # If is_default=True, set is_default=False on other languages
    if data.get("is_default"):
        st = update(model).values(is_default=False)
        db.execute(st)

    language.update(data)

    db.commit()

    return Success()


@router.patch("/language/order/{lang_type}", response_model=Success)
def change_language_order(
    lang_type: LanguageType, order: list[str], db: Session = Depends(db_main)
):
    all_languages = db.query(Language).all()

    # Get current language order
    language_orders = [order.id for order in all_languages]
    new_order_start = get_language_order_start(language_orders)

    order_mapping = {
        code: order for order, code in enumerate(order, start=new_order_start)
    }

    # Update the language order for the languages in the provided list
    max_order = max(order_mapping.values())
    for language in all_languages:
        if language.code in order_mapping:
            language.id = order_mapping[language.code]
        else:
            # If language is not in the provided list, set its id to the next available order
            max_order += 1
            language.id = max_order

    db.commit()

    return Success(message="Language order changed successfully.")


@router.patch("/language/icon/{language_code}", description="Update language icon")
def update_language_icon(
    language_code: str,
    file: Optional[UploadFile] = None,
    db: Session = Depends(db_main),
):
    language = db.query(Language).filter(Language.code == language_code).first()

    if not language:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="language_not_found"
        )

    if file.content_type not in ALLOWED_IMG_TYPE:
        raise HTTPException(
            status_code=status.HTTP_406_NOT_ACCEPTABLE, detail="invalid_image_file"
        )

    # Allow image less then 0.5 MB only
    if file.size > 0.5 * 1024 * 1024:
        raise HTTPException(
            status_code=status.HTTP_406_NOT_ACCEPTABLE, detail="file_too_large"
        )

    object_name = f"flags/{language_code}"
    add_object_to_s3("public", object_name, file)

    language.icon = s3.presigned_get_object("public", object_name).split("?")[0]

    db.add(language)
    db.commit()

    return Success()


@router.get("/locale/{locale_type}", description="Get language strings in JSON")
def get_locale(
    locale_type: str,
    db_lang: Session = Depends(db_lang),
):
    model = get_lang_model(locale_type, raise_exc=True)

    query = select("*").select_from(model)

    # If category order by category
    category = getattr(model, "category", None)
    has_category = False
    if category:
        query = query.order_by(category)
        has_category = True

    result = db_lang.execute(query.order_by(model.key))

    data = transform_locale_rows(result)

    return {"data": data, "category": has_category}


@router.get(
    "/locale/excel/{locale_type}", description="Get language strings in CSV format"
)
def get_locale_excel(
    locale_type: str,
    db_lang: Session = Depends(db_lang),
):
    model = get_lang_model(locale_type, raise_exc=True)

    query = select("*").select_from(model)

    # If category order by category
    category = getattr(model, "category", None)
    if category:
        query = query.order_by(category)

    result = db_lang.execute(query.order_by(model.key))

    data = result_to_dict(result)

    dataframe = pd.DataFrame(data)

    filename = f"{locale_type}.csv"
    dataframe.to_csv(filename, index=False)

    return FileResponse(filename, media_type="text/csv", filename=filename)


@router.patch("/locale/{locale_type}", description="Update language strings")
def update_locale(
    locale_type: str,
    category: str | None,
    key: str,
    data: dict,
    db_lang: Session = Depends(db_lang),
):
    model = get_lang_model(locale_type, raise_exc=True)

    # If key and category passed in data
    data.pop("key", None)
    data.pop("category", None)

    if not data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="no_data_supplied"
        )

    try:
        column, value = next(iter(data.items()))

        # Validate column against injection
        if not validate_column_name(column):
            raise HTTPException(
                status_code=status.HTTP_406_NOT_ACCEPTABLE, detail="invalid_key"
            )

        query = f"UPDATE {locale_type} SET {column} = :value WHERE key = :key"

        # If the model has category
        if hasattr(model, "category"):
            query = query + " AND category = :category"
            statement = text(query).bindparams(value=value, category=category, key=key)

        else:
            statement = text(query).bindparams(value=value, key=key)

        db_lang.execute(statement)
        db_lang.commit()

    except SQLAlchemyError as err:
        logger.info(f"Error while updating locale: {err}")
        raise HTTPException(
            status_code=status.HTTP_406_NOT_ACCEPTABLE, detail="sql_error"
        )

    return Success(message="Language updated successfully.")


@router.patch(
    "/locale/excel/{locale_type}",
    description="Update the language strings from excel/csv file",
)
def update_language_str_excel(
    locale_type: str, file: UploadFile, db_lang: Session = Depends(db_lang)
):
    model = get_lang_model(locale_type, raise_exc=True)
    existing_df = pd.read_sql_table(locale_type, db_lang_engine)

    allowed_content = [
        "text/csv",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ]

    user_df = pd_read(file, allowed_content=allowed_content)

    # Raise exception if headers don't match
    check_header_match(existing_df, user_df)

    # Index by which two df will get merges
    index = "key"
    if hasattr(model, "category"):
        index.append("category")

    # Merge the DataFrames based on keys (key and category)
    merged_df = merge_dataframe(existing_df, user_df, index=index)

    # Delete values from existing database
    db_lang.query(model).delete()
    db_lang.commit()

    merged_df.to_sql(
        locale_type,
        db_lang_engine,
        if_exists="append",
        index=False,
        chunksize=20,
        method="multi",
    )

    return Success(message="Language updated successfully")
