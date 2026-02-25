from fastapi import APIRouter, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.services.candidate_profile import get_candidate_profile_cv, update_candidate_profile_cv

router = APIRouter(
    prefix="/api/v1/candidates",
    tags=["Candidate"]
)

security = HTTPBearer()

@router.get("/profile-cv")
def get_profile_cv(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    return get_candidate_profile_cv(credentials)

@router.put(
    "/profile-cv",
    summary="Cập nhật profile CV của ứng viên"
)
def update_profile_cv(
    data: dict,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    return update_candidate_profile_cv(data, credentials)