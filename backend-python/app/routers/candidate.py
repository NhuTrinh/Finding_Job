import profile

from fastapi import APIRouter, Depends
from app.core.security import get_current_user
from app.core.dependencies import require_permission
from app.core.enums import Permission
from app.schemas.Candidate import CandidateProfileUpdate
from app.services.candidate import CandidateService

router = APIRouter(prefix="/api/v1/candidates", tags=["Candidate"])
svc = CandidateService()

@router.get(
    "/me",
    summary="Get my candidate profile",
    dependencies=[Depends(require_permission(Permission.VIEW_CANDIDATE_PROFILE))]
)
def get_me(current_user: dict = Depends(get_current_user)):
    profile = svc.get_me(current_user)
    return {"status": "success", "data": profile}

@router.put(
    "/me",
    summary="Update my candidate profile",
    dependencies=[Depends(require_permission(Permission.UPDATE_CANDIDATE_PROFILE))]
)
def update_me(payload: CandidateProfileUpdate, current_user: dict = Depends(get_current_user)):
    patch = payload.model_dump(exclude_unset=True)
    # pydantic returns Address model for address; convert to dict
    if "address" in patch and patch["address"] is not None:
        patch["address"] = patch["address"].model_dump()
    profile = svc.update_me(current_user, patch)
    return {"status": "success", "data": profile}
