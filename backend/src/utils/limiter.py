from slowapi import Limiter
from slowapi.util import get_remote_address

from src.database import db_redis_limit

limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["100/minute"],
    application_limits=["200/minute"],
    storage_uri=db_redis_limit,
)
