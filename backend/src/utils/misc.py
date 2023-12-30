from fastapi import HTTPException, UploadFile, status
from loguru import logger
from pandas import DataFrame
from sqlalchemy.engine.cursor import CursorResult

from src.config import Version, settings
from src.database import db_main_session
from src.database.main.models import UserLog
from src.utils.constants import PANDAS_READ_METHOD


def host_to_version_mapping() -> dict:
    """Mapping of hosts and their corresponding versions"""
    hosts = {}
    host_settings = settings.get("hosts", {})

    for version in Version:
        sites = host_settings.get(version.value, [])
        hosts.update({site: version.value for site in sites})

    return hosts


def combine_dicts(*dicts):
    combined_dict = {}
    for d in dicts:
        for key, value in d.items():
            if key in combined_dict:
                # Handle duplicate keys here
                pass
            else:
                combined_dict[key] = value
    return combined_dict


def row_to_dict(row):
    """Convert SQLAlchemy row into a dictionary"""
    data = {}
    for column in row.__table__.columns:
        value = getattr(row, column.name)
        if value is not None:
            data[column.name] = str(value)
        else:
            data[column.name] = None

    return data


def rows_to_dict(rows):
    """Convert SQLAlchemy rows into a dictionary"""
    data = []

    for row in rows:
        data.append(row_to_dict(row))

    return data


def result_to_dict(result: CursorResult):
    """Convert the output from RAW query to dict"""
    columns = result.keys()
    values = result.all()
    output = [dict(zip(columns, row)) for row in values]

    return output


def r2d_group_by(rows, group_by: str) -> dict:
    """Convert SQLAlchemy rows into a dictionary and group by certain key"""
    input_list = rows_to_dict(rows)

    grouped_dict = {item.pop(group_by): item for item in input_list}

    return grouped_dict


def r2d_group_by_multiple(rows, group_by: list) -> dict:
    """Same as r2d_group_by but with multiple keys"""
    data = rows_to_dict(rows)
    grouped_dict = {}
    for item in data:
        category_values = tuple(item.pop(key) for key in group_by)
        nested_dict = grouped_dict
        for value in category_values[:-1]:
            nested_dict = nested_dict.setdefault(value, {})
        nested_dict[category_values[-1]] = item
    return grouped_dict


def rows_to_list(rows) -> list:
    """Convert SQLAlchemy rows into a list"""
    return [item[0] for item in rows]


def add_to_logs(log_type, user_id, data=None) -> None:
    """Add events to logs"""
    log = UserLog(
        log_type=log_type,
        user_id=user_id,
        data=data,
    )

    db = db_main_session()
    db.add(log)
    db.commit()
    db.close()


def pd_read(file: UploadFile, allowed_content: list = []) -> DataFrame:
    """Read file in pandas"""
    if allowed_content and file.content_type not in allowed_content:
        logger.info(
            f"File uploaded with unacceptable content-type: {file.content_type}"
        )
        raise HTTPException(
            status_code=status.HTTP_406_NOT_ACCEPTABLE,
            detail="unacceptable_content_type",
        )

    method = PANDAS_READ_METHOD.get(file.content_type)

    if not method:
        raise HTTPException(
            status_code=status.HTTP_406_NOT_ACCEPTABLE,
            detail="unacceptable_content_type",
        )

    return method(file.file)


def transform_locale_rows(result: CursorResult):
    """
    Transforms the original list into a desired format.

    This function takes the original list of dictionaries and transforms it into a new format.
    The 'keys' field of each transformed item contains the specified keys from the original dictionary.
    The 'languages' field includes all the remaining key-value pairs in the dictionary.
    """
    data = result_to_dict(result)
    transformed_list = []

    for item in data:
        keys = {"key": item.pop("key", None), "category": item.pop("category", None)}

        transformed_item = {"keys": keys, "languages": item}
        transformed_list.append(transformed_item)

    return transformed_list
