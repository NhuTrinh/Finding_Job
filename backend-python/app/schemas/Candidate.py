from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Any, Dict

class CandidateRegister(BaseModel):
    fullName: str
    email: EmailStr
    password: str

class CandidateLogin(BaseModel):
    email: EmailStr
    password: str

class Address(BaseModel):
    line: str = ""
    city: str = ""
    country: str = ""

class CandidateProfile(BaseModel):
    accountId: str
    fullName: str
    email: EmailStr
    avatar: str = ""
    jobTitle: str = ""
    phoneNumber: str = ""
    birthDay: str = ""
    address: Address = Address()
    link: str = ""
    aboutMe: str = ""
    education: List[Dict[str, Any]] = []
    workExperience: List[Dict[str, Any]] = []
    skills: List[str] = []
    projects: List[Dict[str, Any]] = []
    certificates: List[Dict[str, Any]] = []
    languages: List[Dict[str, Any]] = []
    interests: List[str] = []
    createdAt: str = ""
    updatedAt: str = ""

class CandidateProfileUpdate(BaseModel):
    fullName: Optional[str] = None
    avatar: Optional[str] = None
    jobTitle: Optional[str] = None
    phoneNumber: Optional[str] = None
    birthDay: Optional[str] = None
    address: Optional[Address] = None
    link: Optional[str] = None
    aboutMe: Optional[str] = None
    education: Optional[List[Dict[str, Any]]] = None
    workExperience: Optional[List[Dict[str, Any]]] = None
    skills: Optional[List[str]] = None
    projects: Optional[List[Dict[str, Any]]] = None
    certificates: Optional[List[Dict[str, Any]]] = None
    languages: Optional[List[Dict[str, Any]]] = None
    interests: Optional[List[str]] = None

class ApplyJobRequest(BaseModel):
    jobId: str
