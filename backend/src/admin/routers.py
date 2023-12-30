from fastapi import APIRouter, Depends

from src.admin.languages.routers import router as local_router
from src.admin.miscellenous.router import router as miscellenous_router
from src.utils.authentication import authenticate_user
from src.utils.response import Success

router = APIRouter(
    prefix="/admin", dependencies=[Depends(authenticate_user(admin=True))]
)


@router.get("/", description="Check if user has admin access or not")
def admin_authorize():
    return Success()


# Routers
router.include_router(local_router)
router.include_router(miscellenous_router)
