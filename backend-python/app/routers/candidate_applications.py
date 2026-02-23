from fastapi import APIRouter, Depends
from app.core.security import get_current_user
from app.core.dependencies import require_permission
from app.core.enums import Permission
from app.schemas.Candidate import ApplyJobRequest
from app.services.candidate_application import CandidateApplicationService

router = APIRouter(prefix="/api/v1/candidate/applications", tags=["Candidate Applications"])
svc = CandidateApplicationService()

@router.post(
    "",
    summary="Apply to a job",
    dependencies=[Depends(require_permission(Permission.APPLY_JOB))]
)
def apply_job(payload: ApplyJobRequest, current_user: dict = Depends(get_current_user)):
    return svc.apply(current_user, payload.jobId)

@router.get(
    "",
    summary="List my applications",
    dependencies=[Depends(require_permission(Permission.VIEW_OWN_APPLICATIONS))]
)
def list_my_applications(current_user: dict = Depends(get_current_user)):
    return svc.my_applications(current_user)

@router.delete(
    "/{id}",
    summary="Withdraw an application",
    dependencies=[Depends(require_permission(Permission.WITHDRAW_APPLICATION))]
)
def withdraw_application(id: str, current_user: dict = Depends(get_current_user)):
    return svc.withdraw(current_user, id)
