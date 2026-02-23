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
    
    jobs = load_json_file(DATA_FILE_JOBS)
    application = load_json_file(DATA_FILE_APPLICATION)
    profile = load_json_file(DATA_FILE_PROFILE)
    candidate = load_json_file(DATA_FILE_CANDIDATE)

    recruiter_id = payload.get("id")

    profile_map = {p["accountId"]: p for p in profile}
    account_map = {a["id"]: a for a in candidate}
    job_map = {j["_id"]: j for j in jobs}

    result = []

    for app in application:
        app_item = app.copy()
        account_id = app["candidateId"]

        # ===== candidate =====
        profile = profile_map.get(account_id)
        if profile:
            candidate = profile.copy()
            account = account_map.get(account_id)

            candidate["accountId"] = {
                "_id": account["id"],
                "fullName": account["fullName"],
                "email": account["email"]
            } if account else None
        else:
            candidate = None

        app_item["candidateId"] = candidate
        app_item["jobId"] = job_map.get(app["jobId"])

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