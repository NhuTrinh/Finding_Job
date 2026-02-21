from fastapi import HTTPException
from app.utils.json_helper import load_json_file, save_json_file
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[1]
DATA_FILE_APPLICATION = BASE_DIR / "data" / "application.json"
DATA_FILE_JOBS = BASE_DIR / "data" / "job.json"
DATA_FILE_PROFILE = BASE_DIR / "data" / "profile.json"
DATA_FILE_CANDIDATE = BASE_DIR / "data" / "candidate.json"


def get_application(recruiter_id: str):
    # recruiter_id hiện chưa dùng để lọc theo job thuộc recruiter (có thể thêm sau)
    jobs = load_json_file(DATA_FILE_JOBS)
    applications = load_json_file(DATA_FILE_APPLICATION)
    profiles = load_json_file(DATA_FILE_PROFILE)
    candidates = load_json_file(DATA_FILE_CANDIDATE)

    profile_map = {p["accountId"]: p for p in profiles}
    account_map = {a["id"]: a for a in candidates}
    job_map = {j["_id"]: j for j in jobs}

    result = []

    for app in applications:
        app_item = app.copy()
        account_id = app.get("candidateId")

        # ===== candidate =====
        p = profile_map.get(account_id)
        if p:
            candidate_profile = p.copy()
            account = account_map.get(account_id)

            candidate_profile["accountId"] = {
                "_id": account["id"],
                "fullName": account["fullName"],
                "email": account["email"]
            } if account else None
        else:
            candidate_profile = None

        app_item["candidateId"] = candidate_profile
        app_item["jobId"] = job_map.get(app.get("jobId"))

        result.append(app_item)

    return {"status": "success", "data": result}


def accept_application(application_id: str, recruiter_id: str):
    applications = load_json_file(DATA_FILE_APPLICATION)

    for app in applications:
        if app["_id"] == application_id:
            app["status"] = "accept"
            save_json_file(DATA_FILE_APPLICATION, applications)
            return {
                "status": "success",
                "message": "Application accepted successfully.",
                "data": app
            }

    raise HTTPException(status_code=404, detail="Application not found")


def reject_application(application_id: str, recruiter_id: str):
    applications = load_json_file(DATA_FILE_APPLICATION)

    for app in applications:
        if app["_id"] == application_id:
            app["status"] = "reject"
            save_json_file(DATA_FILE_APPLICATION, applications)
            return {
                "status": "success",
                "message": "Application rejected successfully.",
                "data": app
            }

    raise HTTPException(status_code=404, detail="Application not found")