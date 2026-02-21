from fastapi import APIRouter, Depends
from app.schemas.Job import CreateJob

from app.core.security import get_current_user
from app.core.dependencies import require_permission
from app.core.enums import Permission

from app.services import job as job_service

router = APIRouter(prefix="/api/v1/jobs", tags=["Job"])


# ===== PUBLIC (cho khách) =====

@router.get(
    "/{id}",
    summary="Lấy thông tin chi tiết của một job (Public)",
    description="Guest không đăng nhập vẫn xem được job theo ID"
)
def get_job_details(id: str):
    return job_service.get_details_job_by_id(id)





# ===== PROTECTED (cần login + RBAC) =====

@router.post(
    "",
    summary="Tạo job mới",
    description="Tạo một job mới",
    dependencies=[Depends(require_permission(Permission.CREATE_JOB))]
)
def create_new_job(job: CreateJob, current_user=Depends(get_current_user)):
    return job_service.create_job(job, recruiter_id=current_user["user_id"])


@router.get(
    "/recruiter",
    summary="Lấy danh sách job của nhà tuyển dụng",
    description="Chỉ recruiter/admin xem job của chính mình",
    dependencies=[Depends(require_permission(Permission.VIEW_JOB))]
)
def get_jobs_recruiter(current_user=Depends(get_current_user)):
    return job_service.get_job_of_recruiter(recruiter_id=current_user["user_id"])


@router.put(
    "/{id}",
    summary="Cập nhật thông tin job",
    description="Cập nhật thông tin job",
    dependencies=[Depends(require_permission(Permission.UPDATE_JOB))]
)
def update_job(id: str, job: CreateJob, current_user=Depends(get_current_user)):
    return job_service.update_job_by_id(id, job, recruiter_id=current_user["user_id"])


@router.delete(
    "/{id}",
    summary="Xoá một job",
    description="Xoá một job dựa trên ID",
    dependencies=[Depends(require_permission(Permission.DELETE_JOB))]
)
def delete_job(id: str, current_user=Depends(get_current_user)):
    return job_service.delete_job_by_id(id, recruiter_id=current_user["user_id"])