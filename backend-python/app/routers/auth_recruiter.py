from fastapi import APIRouter, Depends
from fastapi.security import HTTPAuthorizationCredentials
from app.schemas.Recruiter import UserRegister 
from app.schemas.Recruiter import UserLogin 
from app.services.auth_recruiter import register_recruiter, login_recruiter, get_recruiter_profile


router  = APIRouter(prefix="/api/v1/accounts/recruiter", tags=["Recruiter Authentication"])

@router.post("/register", summary="Tạo account cho nhà tuyển dụng", description="Tạo account cho nhà tuyển dụng")
def register(user: UserRegister):
    return register_recruiter(user)

@router.post("/login", summary="Đăng nhập cho nhà tuyển dụng", description="Đăng nhập cho nhà tuyển dụng")
def login(user: UserLogin):
    return login_recruiter(user)