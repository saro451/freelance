from fastapi import (
    APIRouter,
    BackgroundTasks,
    Depends,
    File,
    HTTPException,
    Request,
    UploadFile,
    status,
)
from sqlmodel import Session

from src.appglobals import g
from src.auth.utils import create_jwt_token
from src.database import db_main, db_org
from src.database.main.models import OrgSetting, Role, User
from src.mybusiness.models import BusinessDetail, BusinessSetting, StandardText
from src.mybusiness.schemas import InviteUser
from src.services.email import send_email
from src.utils.authentication import authenticate_user
from src.utils.constants import ALLOWED_IMG_TYPE
from src.utils.misc import combine_dicts
from src.utils.response import Success
from src.utils.s3 import add_object_to_s3, get_object_url, object_exists

router = APIRouter(dependencies=[Depends(authenticate_user())])


@router.get("/business/details", response_model=BusinessDetail)
def get_business_details(db_org: Session = Depends(db_org)):
    details = db_org.query(BusinessDetail).first()

    return details or BusinessDetail()


@router.patch("/business/details")
def update_business_details(
    data: BusinessDetail,
    db_org: Session = Depends(db_org),
):
    details = db_org.query(BusinessDetail).first()

    if details:
        for field, value in data.dict(exclude_unset=True).items():
            setattr(details, field, value)

    else:
        details = BusinessDetail(**data.dict())

    db_org.add(details)
    db_org.commit()

    return Success()


@router.get("/business/settings", response_model=BusinessSetting)
def get_business_settings(db_org: Session = Depends(db_org)):
    details = db_org.query(BusinessSetting).first()

    return details or BusinessSetting()


@router.patch("/business/settings")
def update_business_settings(
    data: BusinessSetting,
    db_org: Session = Depends(db_org),
):
    details = db_org.query(BusinessSetting).first()

    if details:
        for field, value in data.dict(exclude_unset=True).items():
            setattr(details, field, value)

    else:
        details = BusinessSetting(**data.dict())

    db_org.add(details)
    db_org.commit()

    return Success()


@router.get("/business/texts", response_model=StandardText)
def get_standard_texts(db_org: Session = Depends(db_org)):
    details = db_org.query(StandardText).first()

    return details or StandardText()


@router.patch("/business/texts")
def update_standard_texts(
    data: StandardText,
    db_org: Session = Depends(db_org),
):
    details = db_org.query(StandardText).first()

    if details:
        for key, value in data.dict(exclude_unset=True).items():
            setattr(details, key, value)

    else:
        details = StandardText(**data.dict())

    db_org.add(details)
    db_org.commit()

    return Success()


@router.get("/business/logo")
def get_logo(request: Request):
    org_id = request.state.user.org_id

    if not object_exists(bucket="logo", object=org_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="logo_not_found"
        )

    signed_url = get_object_url("logo", org_id)

    return {"url": signed_url}


@router.patch("/business/logo")
@router.patch("/user/logo")
def update_logo(request: Request, file: UploadFile = File(...)):
    if file.content_type not in ALLOWED_IMG_TYPE:
        raise HTTPException(
            status_code=status.HTTP_406_NOT_ACCEPTABLE, detail="invalid_image_file"
        )

    if file.size > 5 * 1024 * 1024:
        raise HTTPException(
            status_code=status.HTTP_406_NOT_ACCEPTABLE, detail="file_too_large"
        )

    if request.url.path.startswith("/business"):
        object_name = request.state.user.org_id
    else:
        object_name = request.state.user.id

    add_object_to_s3("logo", object_name, file)

    return Success()


@router.post("/business/invite")
def invite_user(
    request: Request,
    data: InviteUser,
    bg: BackgroundTasks,
    db: Session = Depends(db_main),
):
    org_id = request.state.user.org_id
    org_setting = db.query(OrgSetting).filter(OrgSetting.org_id == org_id).first()

    current_users = db.query(User).filter(User.org_id == org_id).count()

    if current_users >= org_setting.allowed_users:
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED, detail="user_slot_full"
        )

    new_user = User(**data.dict(), org_id=org_id, role=Role.USER)
    new_user_data = combine_dicts(
        new_user.dict(), request.state.user.organization.dict()
    )

    db.add(new_user)
    db.commit()

    fp_data = {"email": data.email, "token_type": "user_invite"}

    fp_token = create_jwt_token(fp_data)
    login_link = f"https://{g.host}/verify?token={fp_token}"

    bg.add_task(
        send_email,
        ["user_invite", "user_register_alert"],
        url=login_link,
        email_subject="New user joined through invitation",
        **new_user_data,
    )

    return Success(status="user_invited_successfully")
