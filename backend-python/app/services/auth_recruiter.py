import uuid
from fastapi import HTTPException
from app.utils.json_helper import load_json_file, save_json_file
from app.core.security import hash_password, verify_password, create_access_token
from app.core.enums import UserRole
from pathlib import Path
from datetime import datetime
from app.schemas.Recruiter import RecruiterProfileResponse, RecruiterInfo

BASE_DIR = Path(__file__).resolve().parents[1]
DATA_FILE = BASE_DIR / "data" / "auth_register.json"


def register_recruiter(recruiter_data):
    recruiters = load_json_file(DATA_FILE)

    for r in recruiters:
        if r["email"] == recruiter_data.email:
            return {"status": "error", "message": "Recruiter already registered."}

    new_user = recruiter_data.model_dump()
    new_user["id"] = str(uuid.uuid4())
    new_user["password"] = hash_password(new_user["password"])

    recruiters.append(new_user)
    save_json_file(DATA_FILE, recruiters)
    return {"status": "success", "message": "Recruiter registered successfully."}


def login_recruiter(data):
    recruiters = load_json_file(DATA_FILE)

    for r in recruiters:
        if r["email"] == data.email and verify_password(data.password, r["password"]):
            token = create_access_token(user_id=r["id"], role=UserRole.RECRUITER.value)
            return {
                "status": "success",
                "message": "Login successful.",
                "recruiter": r,
                "token": token
            }

    return {"status": "error", "message": "Invalid email or password."}


def get_recruiter_profile(recruiter_id: str):
    recruiters = load_json_file(DATA_FILE)

    recruiter = next((r for r in recruiters if str(r["id"]) == str(recruiter_id)), None)
    if not recruiter:
        raise HTTPException(status_code=404, detail="Recruiter not found")

    now = datetime.utcnow().isoformat() + "Z"

    return RecruiterProfileResponse(
        status="success",
        fullName=recruiter.get("fullName"),
        email=recruiter.get("email"),
        recruiter=RecruiterInfo(
            _id=str(recruiter.get("id")),
            accountId=str(recruiter.get("id")),
            companyId=str(recruiter.get("company", {}).get("id")),
            createdAt=now,
            updatedAt=now
        )
    )


def update_recruiter_profile(recruiter_id: str, updated_data):
    recruiters = load_json_file(DATA_FILE)
    data_update = updated_data.model_dump(exclude_unset=True)

    for index, r in enumerate(recruiters):
        if str(r["id"]) == str(recruiter_id):
            recruiters[index].update(data_update)
            save_json_file(DATA_FILE, recruiters)
            return {
                "status": "success",
                "message": "Profile updated successfully.",
                "data": recruiters[index]
            }

    raise HTTPException(status_code=404, detail="Recruiter not found")