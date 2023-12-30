"""Global authentication utilities"""
from datetime import datetime

from fastapi import Depends, HTTPException, Request, status
from loguru import logger
from sqlmodel import Session, exists, or_

from src.auth.utils import decode_jwt_token
from src.database import db_main
from src.database.main.models import Admin, OrgSetting, User
from src.utils.misc import add_to_logs


def authenticate_user(admin: bool = False) -> None:
    """Authenticate user based token in cookies or headers"""

    def dependancy(request: Request, db: Session = Depends(db_main)):
        token = request.cookies.get("token") or request.headers.get("token")
        jwt_info = decode_jwt_token(token)
        if jwt_info is None or jwt_info.get("token_type") != "login":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="user_not_authenticated",
            )

        user = db.query(User).filter(User.id == jwt_info.get("user_id")).first()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="user_not_authenticated",
            )

        settings = db.query(OrgSetting).filter(OrgSetting.org_id == user.org_id).first()

        check_expiry(settings, user)

        # Check if user is admin or not
        if admin:
            check_admin(db, user.id, user.organization.id)

        request.state.user = user
        request.state.settings = settings

    return dependancy


def check_admin(db: Session, user_id: str = None, org_id: str = None) -> bool:
    """Check if the user is admin or not"""
    admin = (
        db.query(Admin)
        .filter(
            or_(
                Admin.user_id == user_id,
                Admin.org_id == org_id,
            )
        )
        .scalar()
    )

    if not admin:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="user_not_authorized"
        )


def check_expiry(settings, user: User):
    """Check for account expiry"""
    if datetime.utcnow() > settings.account_expiry:
        if settings.account_type == "free":
            add_to_logs("trial_expired", user.id)
            raise HTTPException(
                status_code=status.HTTP_402_PAYMENT_REQUIRED, detail="trial_expired"
            )

        else:
            add_to_logs("account_expired", user.id)
            raise HTTPException(
                status_code=status.HTTP_402_PAYMENT_REQUIRED, detail="account_expired"
            )
