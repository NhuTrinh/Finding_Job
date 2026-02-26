from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import List
from uuid import uuid4

router = APIRouter(
    prefix="/applications",
    tags=["Applications"]
)

# ===== Fake Database (tạm thời) =====
fake_applications_db = []


# ===== Schema =====
class ApplicationCreate(BaseModel):
    job_id: str
    candidate_id: str
    resume_url: str


class ApplicationResponse(BaseModel):
    id: str
    job_id: str
    candidate_id: str
    resume_url: str


# ===== Routes =====

@router.post("/", response_model=ApplicationResponse, status_code=status.HTTP_201_CREATED)
def create_application(application: ApplicationCreate):
    new_application = {
        "id": str(uuid4()),
        "job_id": application.job_id,
        "candidate_id": application.candidate_id,
        "resume_url": application.resume_url
    }

    fake_applications_db.append(new_application)
    return new_application


@router.get("/", response_model=List[ApplicationResponse])
def get_all_applications():
    return fake_applications_db


@router.get("/{application_id}", response_model=ApplicationResponse)
def get_application(application_id: str):
    for app in fake_applications_db:
        if app["id"] == application_id:
            return app
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Application not found"
    )