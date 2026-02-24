import uuid
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.utils.json_helper import load_json_file, save_json_file
from app.utils.security import hash_password, verify_password, create_access_token, decode_token
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parents[1]
DATA_FILE_APPLICATION = BASE_DIR / "data" / "application.json"
DATA_FILE_JOBS = BASE_DIR / "data" / "job.json"
DATA_FILE_PROFILE = BASE_DIR / "data" / "profile.json"
DATA_FILE_CANDIDATE = BASE_DIR / "data" / "candidate_accounts.json"
security = HTTPBearer()

def get_application(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = decode_token(token)

    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")

    recruiter_id = payload.get("id")

    jobs = load_json_file(DATA_FILE_JOBS)
    applications = load_json_file(DATA_FILE_APPLICATION)
    profiles = load_json_file(DATA_FILE_PROFILE)
    candidates = load_json_file(DATA_FILE_CANDIDATE)

    profile_map = {p["accountId"]: p for p in profiles}
    account_map = {a["id"]: a for a in candidates}
    job_map = {j["_id"]: j for j in jobs}

    result = []

    for app in applications:
        job = job_map.get(app["jobId"])
        if not job:
            continue

        # chỉ lấy application thuộc recruiter đang login
        if job["recruiterId"] != recruiter_id:
            continue

        app_item = app.copy()

        # ===== populate jobId =====
        app_item["jobId"] = job

        # ===== populate candidateId =====
        account_id = app["candidateId"]

        candidate_profile = profile_map.get(account_id)
        account = account_map.get(account_id)

        if candidate_profile:
            candidate_data = candidate_profile.copy()

            if account:
                candidate_data["accountId"] = {
                    "_id": account["id"],
                    "fullName": account["fullName"],
                    "email": account["email"]
                }

            app_item["candidateId"] = candidate_data
        else:
            app_item["candidateId"] = None

        if app_item["status"] != "withdrawn":
            result.append(app_item)


    return {
        "status": "success",
        "data": result
    }

def accept_application(id, credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = decode_token(token)

    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    application = load_json_file(DATA_FILE_APPLICATION)

    for app in application:
        if app['_id'] == id:
            app['status'] = 'accept'
            save_json_file(DATA_FILE_APPLICATION, application)
            return {
                'status': 'success',
                'message': 'Application accepted successfully.',
                'data': app
            }
    
def reject_application(id, credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = decode_token(token)

    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    application = load_json_file(DATA_FILE_APPLICATION)

    for app in application:
        if app['_id'] == id:
            app['status'] = 'reject'
            save_json_file(DATA_FILE_APPLICATION, application)
            return {
                'status': 'success',
                'message': 'Application reject successfully.',
                'data': app
            }