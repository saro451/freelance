from enum import Enum


class QueryOn(Enum):
    """Type to choose in which db to run the query"""

    MAIN_DB = "main_db"
    ORG_DB = "org_db"
