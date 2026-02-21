from fastapi import APIRouter, Depends
from app.schemas.Recruiter import RecruiterProfileResponse, UserProfile

from app.core.security import get_current_user
from app.core.dependencies import require_permission
from app.core.enums import Permission

from app.services.auth_recruiter import get_recruiter_profile, update_recruiter_profile

router = APIRouter(prefix="/api/v1/recruiters", tags=["Recruiter Information"])


@router.get(
    "/profile",
    summary="Lấy thông tin profile của nhà tuyển dụng",
    description="Lấy thông tin profile của nhà tuyển dụng",
    response_model=RecruiterProfileResponse,
    dependencies=[Depends(require_permission(Permission.VIEW_COMPANY))]
)
def get_profile(current_user=Depends(get_current_user)):
    return get_recruiter_profile(recruiter_id=current_user["user_id"])


@router.put(
    "/profile",
    summary="Cập nhật thông tin profile của nhà tuyển dụng",
    description="Cập nhật thông tin profile của nhà tuyển dụng",
    dependencies=[Depends(require_permission(Permission.UPDATE_COMPANY))]
)
def update_profile(user: UserProfile, current_user=Depends(get_current_user)):
    return update_recruiter_profile(recruiter_id=current_user["user_id"], updated_data=user)