"""Re-format the response for HTTPException and RequestValidationError."""

from fastapi import HTTPException, Request, Response, status
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from slowapi.errors import RateLimitExceeded

from src.database.language.utils import get_language_dict
from src.utils.response import Error


async def validation_exception_handler(
    request: Request, exc: RequestValidationError
) -> Response:
    errors = exc.errors() or []
    locale = request.headers.get("Accept-Language")
    language_dict = get_language_dict("backend_strings", locale=locale)

    details = {}
    for err in errors:
        loc = err.get("loc")[-1] if err.get("loc") else None
        error_code = (
            err.get("msg") if err.get("type") == "value_error" else err.get("type")
        )
        error_message = language_dict.get(error_code)

        details[loc] = (
            error_message.format(**err.get("ctx", {}))
            if error_message
            else err.get("msg")
        )

    response = Error(
        error="validation_error",
        detail=details,
        debug=errors,
    )

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=jsonable_encoder(response),
    )


async def http_exception_handler(request: Request, exc: HTTPException) -> Response:
    detail = exc.detail

    if isinstance(detail, dict):
        # If message is already present, just return
        if detail.get("message"):
            return JSONResponse(
                status_code=exc.status_code,
                content=jsonable_encoder(detail),
            )

        error_code = detail.pop("error")
        values = detail

    else:
        error_code = detail
        values = {}

    locale = request.headers.get("Accept-Language")
    language_dict = get_language_dict("backend_strings", locale)

    error_message = language_dict.get(error_code)

    response = Error(
        error=error_code,
        message=error_message.format(**values) if error_message else None,
    )

    return JSONResponse(
        status_code=exc.status_code,
        content=jsonable_encoder(response),
    )


def rate_limit_exception_handler(request: Request, exc: RateLimitExceeded) -> Response:
    response = Error(
        error="rate_limit_exceed", message="Too many requests. Please try again later."
    )

    request.app.state.limiter._inject_headers(response, request.state.view_rate_limit)

    return JSONResponse(content=jsonable_encoder(response), status_code=429)
