from fastapi import APIRouter, Depends

from app.core.security import get_current_user
from app.core.dependencies import require_permission
from app.core.enums import Permission

from app.services import application as application_service

router = APIRouter(prefix="/api/v1/applications", tags=["Applications"])


@router.get(
    "/recruiter",
    summary="Lấy tất cả các ứng dụng mà nhà tuyển dụng đã nhận được",
    description="Lấy danh sách các ứng viên mà nhà tuyển dụng đã nhận được",
    dependencies=[Depends(require_permission(Permission.VIEW_JOB))]
)
def get_applications_for_recruiter(current_user=Depends(get_current_user)):
    return application_service.get_application(recruiter_id=current_user["user_id"])


@router.patch(
    "/{id}/accept",
    summary="Chấp nhận ứng dụng của ứng viên",
    description="Cập nhật trạng thái của ứng dụng thành 'accept'",
    dependencies=[Depends(require_permission(Permission.UPDATE_JOB))]
)
def accept_applications_for_recruiter(id: str, current_user=Depends(get_current_user)):
    return application_service.accept_application(application_id=id, recruiter_id=current_user["user_id"])


@router.patch(
    "/{id}/reject",
    summary="Từ chối ứng dụng của ứng viên",
    description="Cập nhật trạng thái của ứng dụng thành 'reject'",
    dependencies=[Depends(require_permission(Permission.UPDATE_JOB))]
)
def reject_applications_for_recruiter(id: str, current_user=Depends(get_current_user)):
    return application_service.reject_application(application_id=id, recruiter_id=current_user["user_id"])