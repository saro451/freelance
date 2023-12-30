from .utils import get_redis_client, get_redis_db_url

db_redis_document = get_redis_client(1)  # Database for storing about documents edit
db_redis_limit = get_redis_db_url(2)  # Database for storing limit on endpoints
db_redis_cache = get_redis_client(
    3, decode_responses=True
)  # Database for storing cache
