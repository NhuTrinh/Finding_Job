from fastapi import APIRouter, Depends
from app.schemas.Company import CompanyOption, CompanyProfile

from app.core.security import get_current_user
from app.core.dependencies import require_permission
from app.core.enums import Permission

from app.services.company import get_company, update_company, get_company_by_id

router = APIRouter(prefix="/api/v1/companies", tags=["Company"])


# ===== PUBLIC =====

@router.get("/", response_model=list[CompanyOption], summary="Lấy danh sách công ty cho UI render")
def get_company_list():
    return get_company()


@router.get("/{id}", summary="Lấy thông tin profile của công ty theo id")
def get_company_info(id: int):
    return get_company_by_id(id)


# ===== PROTECTED =====

@router.put(
    "/{id}",
    summary="Cập nhật thông tin công ty theo id",
    dependencies=[Depends(require_permission(Permission.UPDATE_COMPANY))]
)
def update_company_info(id: int, Company_Profile: CompanyProfile, current_user=Depends(get_current_user)):
    # current_user có thể dùng sau này để check recruiter chỉ sửa company của mình
    return update_company(id, Company_Profile)