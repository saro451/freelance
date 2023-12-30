"""Main module for the FastAPI application."""
import logging
from pathlib import Path

import sentry_sdk
from fastapi import FastAPI, HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse, Response
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from starlette.middleware.cors import CORSMiddleware

from src.admin.routers import router as admin_router
from src.auth.routers import router as auth_router
from src.miscellenous.routers import router as miscellenous_router
from src.mybusiness.routers import router as mybusiness_router
from src.pricelist.routers import router as pricelist_router
from src.utils.misc import host_to_version_mapping

from .appglobals import g
from .config import Version, settings
from .database import create_main_tables
from .exceptions.response import (
    http_exception_handler,
    rate_limit_exception_handler,
    validation_exception_handler,
)
from .utils import limiter

logger = logging.getLogger(__name__)
config_path = Path(__file__).with_name("logging_config.json")

URL_PREFIX = "/api/v1"
host_map = host_to_version_mapping()

if settings.fastapi_env and settings.fastapi_env != "local":
    logger.info("Initializing sentry SDK")
    sentry_sdk.init(
        dsn=settings.SENTRY_DSN,
        traces_sample_rate=1.0,
        profiles_sample_rate=1.0,
        environment="local",
    )


def create_app() -> FastAPI:
    app = FastAPI(
        debug=True if settings.fastapi_env == "development" else False,
        title=settings.app_name,
        version=settings.app_version,
        description=settings.app_description,
    )
    # logger = Logger.make_logger(config_path)
    # app.logger = logger

    return app


app = create_app()

if settings.fastapi_env in ["development", "testing"]:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:3000"],
        allow_credentials=True,
        allow_methods=["GET", "POST", "DELETE", "OPTIONS", "PATCH", "PUT"],
        allow_headers=["Content-Type", "Accept-Language", "Token", "Cookie"],
    )

# Add routers
app.include_router(admin_router, prefix=URL_PREFIX, tags=["Admin Panel"])
app.include_router(auth_router, prefix=URL_PREFIX, tags=["Authentications"])
app.include_router(mybusiness_router, prefix=URL_PREFIX, tags=["My Business"])
app.include_router(miscellenous_router, prefix=URL_PREFIX, tags=["Miscellenous"])
app.include_router(pricelist_router, prefix=URL_PREFIX, tags=["Price List"])

# Exception handlers
app.exception_handler(RequestValidationError)(validation_exception_handler)
app.exception_handler(HTTPException)(http_exception_handler)
app.add_exception_handler(RateLimitExceeded, rate_limit_exception_handler)

# Add mounts
# app.mount(
#     "/static/products",
#     StaticFiles(directory="../templates/products/css"),
#     name="products",
# )

# Rate limit handlers
app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)


@app.middleware("http")
async def middleware_events(request: Request, call_next):
    host = request.headers.get("host")
    request.state.version = host_map.get(host)

    if not request.state.version:
        return JSONResponse(
            content={"error": "unregistered_host"},
            status_code=status.HTTP_400_BAD_REQUEST,
        )

    language = request.headers.get("accept-language", "english")

    logger.info(
        f"Serving request from {host} -> {request.state.version} version | {language}"
    )

    g.initialize(
        {
            "host": host,
            "language": language,
            "version": request.state.version,
            "request": request,
        }
    )

    response = await call_next(request)

    return response


@app.on_event("startup")
def app_startup():
    for version in Version:
        logger.info(f"Creating metadata for {version.value} database.")
        create_main_tables(version.value)


@app.get("/api", tags=["Health Check"])
def root(request: Request):
    return Response(f"Welcome to Lettfaktura {request.state.version} API!!")
