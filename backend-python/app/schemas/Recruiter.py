from pydantic import BaseModel, EmailStr, Field

class Address(BaseModel):
    line: str
    city: str
    country: str

class Company(BaseModel):
    id: int
    name: str
    address: Address

class UserRegister(BaseModel):
    fullName: str
    email: str
    password: str
    company: Company


class UserLogin(BaseModel):
    email: str
    password: str

class RecruiterInfo(BaseModel):
    id: str = Field(..., alias="_id")
    accountId: str
    companyId: str
    createdAt: str
    updatedAt: str

    model_config = {
        "populate_by_name": True
    }

class RecruiterProfileResponse(BaseModel):
        status: str
        fullName: str
        email: str
        recruiter: RecruiterInfo

class UserProfile(BaseModel):
    fullName: str