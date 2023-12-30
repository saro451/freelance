from typing import List

from fastapi import HTTPException, status
from loguru import logger
from pandas import DataFrame


def check_header_match(original_df: DataFrame, new_df: DataFrame):
    """Check if the header of two dataframe files matches or not"""
    original_columns = set(original_df.columns)
    new_columns = set(new_df.columns)

    if not new_columns.issubset(original_columns):
        logger.info(
            f"Dataframe with mismatch headers found | Original: {original_columns} | New DF: {new_columns}"
        )
        raise HTTPException(
            status_code=status.HTTP_406_NOT_ACCEPTABLE,
            detail="invalid_headers",
        )


def merge_dataframe(
    original_df: DataFrame, new_df: DataFrame, index: List
) -> DataFrame:
    """Merge two dataframes into one"""
    merged_df = (
        new_df.set_index(index)
        .combine_first(original_df.set_index(index))
        .reset_index()
    )

    return merged_df


def get_language_order_start(current_order: list[int]) -> int:
    """To change the language order, we need to change it's ID. Since id is a primary key.
    we need to start the ID which is not assigned to other languages. This function helps to generate a number
    to start the lanuguage oreder.
    """
    if not current_order or len(current_order) < min(current_order):
        return 1
    greater_number = max(current_order) + 1
    return greater_number
