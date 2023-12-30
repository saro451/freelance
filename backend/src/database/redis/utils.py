import redis

from src.config import settings


def get_redis_client(db: int, decode_responses: bool = False) -> redis.Redis:
    """Get a redis connection"""
    return redis.Redis(
        host=settings.REDIS_HOST,
        port=settings.REDIS_PORT,
        db=db,
        decode_responses=decode_responses,
    )


def get_redis_db_url(database: str) -> str:
    """Get a redis connection URL"""
    return "redis://{host}:{port}/{database}".format(
        host=settings.REDIS_HOST,
        port=settings.REDIS_PORT,
        database=database,
    )
