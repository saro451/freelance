import json

from fastapi import HTTPException, status
from sqlmodel import Session

from src.database import db_redis_document

from .models import Product


def get_product_unique_id(db: Session, product_id: int) -> str | Exception:
    """Get the unique id of a product"""
    unique_id = db.query(Product.unique_id).filter(Product.id == product_id).scalar()

    if not unique_id:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            "product_not_found",
        )

    return unique_id


def raise_if_edit_conflict(
    db: Session, product_id: int, user_id: str
) -> Exception | str:
    """Raise HTTP exception if product is already in edit"""
    unique_id = get_product_unique_id(db, product_id)

    data = db_redis_document.get(unique_id) or "{}"
    previous_editor = json.loads(data)

    if previous_editor and previous_editor.get("user_id") != user_id:
        raise HTTPException(
            status.HTTP_409_CONFLICT,
            detail={
                "error": "product_edit_conflict",
                "name": previous_editor.get("name"),
            },
        )

    return unique_id
