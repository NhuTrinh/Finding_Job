from fastapi import APIRouter, Depends
from fastapi.security import HTTPAuthorizationCredentials
from app.schemas.Job import CreateJob 
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.services.job import create_job, get_details_job_by_id, get_job_of_recruiter, update_job_by_id, delete_job_by_id
from app.services.job import get_all_jobs

security = HTTPBearer()

router  = APIRouter(prefix="/api/v1/jobs", tags=["Job"])

@router.get(
    "",
    summary="Lấy danh sách job",
    description="Lấy tất cả job"
)
def list_jobs():
    return {"status": "success", "data": get_all_jobs()}

def create_new_job(job: CreateJob, credentials: HTTPAuthorizationCredentials = Depends(security)):
    return create_job(job, credentials)

@router.get("/recruiter", summary="Lấy danh sách job của nhà tuyển dụng", description="Lấy danh sách job của nhà tuyển dụng")
def get_jobs_recruiter(credentials: HTTPAuthorizationCredentials = Depends(security)):
    return get_job_of_recruiter(credentials)

@router.put("/{id}", summary="Cập nhật thông tin job", description="Cập nhật thông tin job")
def update_job(job: CreateJob, id: str, credentials: HTTPAuthorizationCredentials = Depends(security)):
    return update_job_by_id(id, job, credentials)

@router.get("/{id}", summary="Lấy thông tin chi tiết của một job", description="Lấy thông tin chi tiết của một job dựa trên ID")
def get_job_details(id: str):
    return get_details_job_by_id(id)


@router.delete("/{id}", summary="Xoá một job", description="Xoá một job dựa trên ID")
def delete_job(id: str, credentials: HTTPAuthorizationCredentials = Depends(security)):
    return delete_job_by_id(id, credentials)

