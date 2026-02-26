from fastapi import APIRouter, Depends
from app.core.dependencies import require_permission
from app.core.enums import Permission

router = APIRouter()


@router.post("/jobs")
def create_job(
    current_user=Depends(require_permission(Permission.CREATE_JOB))
):
    return {"message": "Job created"}