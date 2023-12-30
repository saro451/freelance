from fastapi import APIRouter, Depends, HTTPException, Request
from loguru import logger
from sqlmodel import Session

import src.admin.miscellenous.types as MiscAdminType
from src.config import Version
from src.database import (
    db_main,
    db_main_session,
    db_org_session,
    db_redis_cache,
    delete_org_database,
)
from src.database.main.models import Organization
from src.database.utils import execute_raw_query
from src.utils.response import Error, Success

router = APIRouter()


@router.delete("/cache")
def delete_cache():
    db_redis_cache.flushdb()

    return Success()


@router.delete("/organization/{org_id}")
def delete_organization(request: Request, org_id: str, db: Session = Depends(db_main)):
    logger.info(f"Deleting organization {org_id}")

    # Delete the organization
    org = db.query(Organization).filter(Organization.id == org_id).first()
    if not org:
        raise HTTPException(404, detail="organization_not_found")

    db.delete(org)
    db.commit()

    # Delete the organization database
    delete_org_database(request.state.version, org_id)

    return Success(status="organization_deleted")


@router.post(
    "/database/query",
    description="[WARNING] Perform a query against organizations database",
)
def database_query(
    query: str,
    version: Version = None,
    query_on: MiscAdminType.QueryOn = MiscAdminType.QueryOn.ORG_DB,
):
    logger.info(f"Database query endpoint is called with query: {query}")
    org_ids = []

    if version:
        # If version is specified
        versions = [version.value]
    else:
        # If version is not specified
        versions = [v.value for v in Version]

    # If query is for main database
    if query_on == MiscAdminType.QueryOn.MAIN_DB:
        for version in versions:
            logger.info(f"Executing raw query on main database: {version}")

            try:
                execute_raw_query(db_main_session, query)

            except Exception as err:
                return Error(
                    error="sql_error",
                    message=str(err),
                )

        return Success()

    # If query is for organiztaion database
    logger.info(f"Getting org_ids for {versions}")
    for version in versions:
        db = db_main_session(version)
        ids = [org[0] for org in db.query(Organization.id).all()]
        db.close()

        logger.info(f"{len(ids)} organization IDs found in {version} version.")

        org_ids.extend(ids)

    logger.info(f"Running query on {len(org_ids)} organization databases!!")

    for org_id in org_ids:
        logger.info(f"Executing raw query on organization: {org_id}")
        try:
            execute_raw_query(db_org_session, query, org_id)
        except Exception as e:
            return Error(
                error="sql_error",
                message=str(e),
            )

    return Success()
