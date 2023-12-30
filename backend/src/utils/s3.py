import minio
from fastapi import File, HTTPException, status

from src.config import settings
from src.database.redis.database import db_redis_cache

endpoint_url = settings.S3_API_URL
access_key = settings.S3_ACCESS_KEY
secret_key = settings.S3_SECRET_KEY

s3 = minio.Minio(endpoint_url, access_key, secret_key)


def object_exists(bucket: str, object: str):
    """Check if object exists in bucket or not"""
    try:
        s3.stat_object(bucket, object)
        return True

    except minio.error.S3Error:
        return False


def get_object_url(bucket_name: str, object_name: str):
    """Get pre-signed URL from redis, if not exists get from S3"""
    KEY = f"s3_{bucket_name}_{object_name}"

    value = db_redis_cache.get(KEY)

    # If URL exists in redis
    if value:
        return value

    url = s3.get_presigned_url("GET", bucket_name, object_name)
    db_redis_cache.set(KEY, url, ex=604000)

    return url


def add_object_to_s3(bucket_name: str, object_name: str, file: File) -> None:
    """Same as put_object but raise HTTP exception on error"""
    try:
        s3.put_object(bucket_name, object_name, file.file, file.size, file.content_type)

    except minio.error.MinioException:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="server_error"
        )
