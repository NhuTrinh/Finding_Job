from fastapi import APIRouter, Depends
from fastapi.security import HTTPAuthorizationCredentials
from app.schemas.Company import CompanyOption 
from app.schemas.Company import CompanyProfile
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.services.company import get_company, update_company, get_company_by_id




router  = APIRouter(prefix="/api/v1/companies", tags=["Company"])

@router.get("/", summary="Lấy danh sách công ty cho UI render", description="Lấy danh sách công ty cho UI render")
def get_company_list():
    return get_company()

@router.put("/{id}", summary="Cập nhật thông tin công ty theo id", description="Cập nhật thông tin công ty theo id")
def update_company_info(id:int, Company_Profile: CompanyProfile):
    return update_company(id, Company_Profile)

@router.get("/{id}", summary="Lấy thông tin profile của công ty theo id", description="Lấy thông tin profile của công ty theo id")
def get_company_info(id: int):
    return get_company_by_id(id)