from fastapi import APIRouter, Depends
from fastapi.security import HTTPAuthorizationCredentials
from app.schemas.Job import CreateJob 
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.services.application import get_application, accept_application, reject_application

security = HTTPBearer()

router  = APIRouter(prefix="/api/v1/applications", tags=["Applications"])

@router.get("/recruiter", summary="Lấy tất cả các ứng dụng mà nhà tuyển dụng đã nhận được", description="Lấy danh sách các ứng viên mà nhà tuyển dụng đã nhận được")
def get_applications_for_recruiter(credentials: HTTPAuthorizationCredentials = Depends(security)):
    return get_application(credentials)


@router.patch("/{id}/accept", summary="Chấp nhận ứng dụng của ứng viên", description="Cập nhật trạng thái của ứng dụng thành 'accepted'")
def accept_applications_for_recruiter(id: str, credentials: HTTPAuthorizationCredentials = Depends(security)):
    return accept_application(id, credentials)

@router.patch("/{id}/reject", summary="Từ chối ứng dụng của ứng viên", description="Cập nhật trạng thái của ứng dụng thành 'rejected'")
def reject_applications_for_recruiter(id: str, credentials: HTTPAuthorizationCredentials = Depends(security)):
    return reject_application(id, credentials)