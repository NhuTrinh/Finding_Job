from fastapi import APIRouter
from app.services.auth_service import AuthService
from app.schemas.user_schema import UserLogin, UserRegister

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register", status_code=201)
def register(user: UserRegister):
    return AuthService.register(user)


@router.post("/login")
def login(user: UserLogin):
    return AuthService.login(user.email, user.password)