from typing import Mapping, Optional

from fastapi import APIRouter, Depends, Request, Response
from sqlmodel import Session

from src.database import db_lang, db_main
from src.database.language.utils import get_language_dict
from src.database.main.models import AppConfig, Language

from .dummy import get_metadata
from .response import ConfigResponse, Link, Metadata

router = APIRouter()


@router.get("/config", response_model=ConfigResponse)
def get_config(request: Request, response: Response, db: Session = Depends(db_main)):
    config = db.query(AppConfig).first()
    config = dict(config) if config else {}

    languages = (
        db.query(Language)
        .filter(Language.is_active == True)  # noqa
        .order_by(Language.id)
        .all()
    )

    metadata = Metadata(**get_metadata())

    response.headers["Cache-Control"] = "max-age=3600"

    return ConfigResponse(
        **config,
        version=request.state.version,
        languages=languages,
        links=Link(**config),
        metadata=metadata,
    )


@router.get(
    "/locals/{language}", response_model=Mapping[str, Mapping[str, Optional[str]]]
)
def get_language(
    response: Response, language: str, db_lang: Session = Depends(db_lang)
):
    result = get_language_dict("ui_strings", language, categorize=True)

    # response.headers["Cache-Control"] = "max-age=3600"

    return result
