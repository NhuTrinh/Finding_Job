from fastapi import HTTPException, status
from app.schemas.user_schema import UserRegister
from app.repositories.user_repository import UserRepository
from app.core.security import (
    create_access_token,
    verify_password,
    hash_password
)

repo = UserRepository()


class AuthService:

    @staticmethod
    def login(email: str, password: str):

        user = repo.find_user_by_email(email)

        if not user or not verify_password(password, user["password"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )

        token = create_access_token(
            user_id=user["id"],
            role=user["role"]
        )

        return {
            "access_token": token,
            "token_type": "bearer"
        }

    @staticmethod
    def register(user: UserRegister):

        existing_user = repo.find_user_by_email(user.email)

        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already exists"
            )

        hashed_password = hash_password(user.password)

        new_user = repo.create_user({
            "name": user.name,
            "email": user.email,
            "password": hashed_password,
            "role": user.role
        })

        return {
            "id": new_user["id"],
            "name": new_user["name"],
            "email": new_user["email"],
            "role": new_user["role"]
        }