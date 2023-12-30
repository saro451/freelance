"""Routers for the auth module"""

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Request
from sqlmodel import Session

from src.appglobals import g
from src.database import create_org_database, db_main
from src.database.main.models import Organization, OrgSetting, User
from src.services.email import send_email
from src.services.telegram import send_notification
from src.utils import limiter
from src.utils.authentication import authenticate_user
from src.utils.misc import combine_dicts
from src.utils.response import Success

from .response import (
    SignupApiResponse,
    TokenResponse,
    UserConfigResponse,
    signupVerifyResponse,
)
from .schemas import (
    CreateUser,
    CreateUserApi,
    ForgotPassword,
    LoginUser,
    SignupUserApi,
    VerifyUser,
)
from .utils import (
    create_jwt_token,
    create_login_token,
    decode_jwt_token,
    email_exists,
    validate_credentials,
)

router = APIRouter()


@router.get(
    "/user",
    description="Get user details",
    dependencies=[Depends(authenticate_user())],
    response_model=UserConfigResponse,
)
def get_user(request: Request, db: Session = Depends(db_main)):
    org_id = request.state.user.org_id
    org_settings = db.query(OrgSetting).filter(OrgSetting.org_id == org_id).first()

    data = combine_dicts(
        request.state.user.dict(),
        request.state.user.organization.dict(),
        org_settings.dict(),
    )

    return UserConfigResponse(**data, user_id=request.state.user.id)


@router.post(
    "/register", description="Register for a new account", response_model=Success
)
def register(bg: BackgroundTasks, user: CreateUser):
    token_data = user.dict()
    token_data["token_type"] = "signup"
    token = create_jwt_token(token_data)

    verifiy_url = f"https://{g.host}/verify?token={token}"

    bg.add_task(send_notification, "user_signup", data=user)
    bg.add_task(
        send_email,
        ["user_signup", "user_register_alert"],
        url=verifiy_url,
        email_subject="New user signup for registration",
        **token_data,
    )

    return Success(status="signup_success")


@router.post(
    "/signup/api",
    description="Signup new account for login integration on other sites",
    response_model=SignupApiResponse,
)
def signup_api(user: CreateUserApi):
    token_data = user.dict()

    if email_exists(g.version, user.email):
        redirect_url = f"https://{g.host}/login-error?email={user.email}"

    else:
        token_data["token_type"] = "signup_integrate"
        token = create_jwt_token(token_data)

        redirect_url = f"https://{g.host}/signup?token={token}"

    return SignupApiResponse(url=redirect_url)


@router.get(
    "/signup/verify",
    description="Check if the signup integrate token is valid or not",
    response_model=signupVerifyResponse,
)
def signup_verify(token: str):
    token_details = decode_jwt_token(token)

    if not token_details or (token_details.get("token_type") != "signup_integrate"):
        raise HTTPException(status_code=401, detail="invalid_token")

    else:
        return signupVerifyResponse(email=token_details.get("email"))


@router.post(
    "/signup",
    description="Signup for a new account",
    response_model=Success,
)
def signup(request: Request, bg: BackgroundTasks, data: SignupUserApi):
    token_data = decode_jwt_token(data.token)

    if not token_data or (token_data.get("token_type") != "signup_integrate"):
        raise HTTPException(status_code=401, detail="invalid_token")

    if email_exists(request.state.version, token_data.get("email")):
        raise HTTPException(status_code=401, detail="email_already_exists")

    # Update the token
    token_data["password"] = data.password
    token_data["token_type"] = "signup_api"

    token = create_jwt_token(token_data)

    verifiy_url = f"https://{g.host}/verify?token={token}"

    bg.add_task(
        send_email,
        ["user_signup", "user_register_alert"],
        url=verifiy_url,
        email_subject="New user signup registration via API",
        **token_data,
    )

    return Success(status="signup_success")


@router.post(
    "/verify",
    description="Verify the email links",
    response_model=TokenResponse,
)
def verify(
    bg: BackgroundTasks,
    request: Request,
    data: VerifyUser,
    db: Session = Depends(db_main),
):
    token_data = decode_jwt_token(data.token)

    allowed_token = ["signup", "signup_api", "forgot_password"]

    if not token_data or token_data.get("token_type") not in allowed_token:
        raise HTTPException(status_code=401, detail="invalid_token")

    if token_data.get("token_type") != "forgot_password":
        if email_exists(request.state.version, token_data.get("email")):
            raise HTTPException(status_code=401, detail="email_already_exists")

        new_org = Organization(**token_data)
        new_user = User(**token_data, org_id=new_org.id)
        org_settings = OrgSetting(org_id=new_org.id)

        db.add(new_org)
        db.add(org_settings)
        db.add(new_user)
        db.commit()

        # Creating new database for the organization
        create_org_database(request.state.version, new_org.id)

        bg.add_task(
            send_email,
            ["user_register_alert"],
            email_subject="A user verified their registration",
            **token_data,
        )

    token = create_login_token(request.state.version, token_data.get("email"))

    return TokenResponse(token=token)


@router.post(
    "/login", description="Login to an existing account", response_model=TokenResponse
)
@limiter.limit("5/minute")
def login(request: Request, data: LoginUser):
    user_exists = validate_credentials(request.state.version, data.email, data.password)

    if not user_exists:
        raise HTTPException(status_code=401, detail="invalid_credentials")

    token = create_login_token(request.state.version, data.email)

    return TokenResponse(token=token)


@router.post("/forgot-password", description="Forgot password", response_model=Success)
def forgot_password(
    bg: BackgroundTasks, data: ForgotPassword, db: Session = Depends(db_main)
):
    email = data.email
    user = db.query(User).filter(User.email == email).first()

    fp_data = {"email": email, "token_type": "forgot_password"}

    fp_token = create_jwt_token(fp_data)
    login_link = f"https://{g.host}/verify?token={fp_token}"

    bg.add_task(
        send_email,
        ["forgot_password"],
        email=email,
        name=user.name,
        password=user.password,
        url=login_link,
    )

    return Success(status="reset_password_success")


@router.post("/logout", dependencies=[Depends(authenticate_user())])
def logout():
    return Success()
