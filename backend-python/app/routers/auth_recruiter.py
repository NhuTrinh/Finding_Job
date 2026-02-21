from fastapi import APIRouter, Depends
from app.schemas.Recruiter import UserRegister, UserLogin, UserProfile  # nếu bạn có schema update profile
from app.services.auth_recruiter import (
    register_recruiter,
    login_recruiter,
    get_recruiter_profile,
    update_recruiter_profile,  # nếu bạn có
)

from app.core.security import get_current_user
from app.core.dependencies import require_permission
from app.core.enums import Permission

router = APIRouter(prefix="/api/v1/accounts/recruiter", tags=["Recruiter Authentication"])


# ===== PUBLIC =====

@router.post("/register", summary="Tạo account cho nhà tuyển dụng")
def register(user: UserRegister):
    return register_recruiter(user)


@router.post("/login", summary="Đăng nhập cho nhà tuyển dụng")
def login(user: UserLogin):
    return login_recruiter(user)


# ===== PROTECTED =====

@router.get(
    "/profile",
    summary="Lấy profile nhà tuyển dụng (cần đăng nhập)",
    dependencies=[Depends(require_permission(Permission.VIEW_JOB))]
)
def profile(current_user=Depends(get_current_user)):
    # recruiter_id là UUID string trong current_user["user_id"]
    return get_recruiter_profile(recruiter_id=current_user["user_id"])


# Nếu bạn có endpoint update profile:
@router.put(
    "/profile",
    summary="Cập nhật profile nhà tuyển dụng (cần đăng nhập)",
    dependencies=[Depends(require_permission(Permission.VIEW_JOB))]
)
def update_profile(payload: UserProfile, current_user=Depends(get_current_user)):
    return update_recruiter_profile(recruiter_id=current_user["user_id"], updated_data=payload)