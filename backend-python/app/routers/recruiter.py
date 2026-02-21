from fastapi import APIRouter, Depends
from fastapi.security import HTTPAuthorizationCredentials
from app.schemas.Recruiter import RecruiterProfileResponse, UserRegister 
from app.schemas.Recruiter import UserLogin 
from app.schemas.Recruiter import UserProfile
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.services.auth_recruiter import register_recruiter, login_recruiter, get_recruiter_profile, update_recruiter_profile

security = HTTPBearer()


router  = APIRouter(prefix="/api/v1/recruiters", tags=["Recruiter Information"])

@router.get("/profile", summary="Lấy thông tin profile của nhà tuyển dụng", description="Lấy thông tin profile của nhà tuyển dụng", response_model=RecruiterProfileResponse)
def get_profile(credentials: HTTPAuthorizationCredentials = Depends(security)):
    return get_recruiter_profile(credentials)

@router.put("/profile", summary="Cập nhật thông tin profile của nhà tuyển dụng", description="Cập nhật thông tin profile của nhà tuyển dụng")
def update_profile(
    user: UserProfile,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    return update_recruiter_profile(user, credentials)

