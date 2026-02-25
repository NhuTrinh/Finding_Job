from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.utils.json_helper import load_json_file, save_json_file
from app.utils.security import decode_token
from pathlib import Path
from copy import deepcopy
from datetime import datetime

BASE_DIR = Path(__file__).resolve().parents[1]
PROFILE_FILE = BASE_DIR / "data" / "profile.json"
ACCOUNT_FILE = BASE_DIR / "data" / "candidate_accounts.json"
security = HTTPBearer()

BASE_DIR = Path(__file__).resolve().parents[1]
AUTH_FILE = BASE_DIR / "data" / "candidate_accounts.json"
PROFILE_FILE = BASE_DIR / "data" / "profile.json"

IMMUTABLE_FIELDS = {"accountId", "fullName", "email", "createdAt"}

def get_account_by_id(account_id: str):
    accounts = load_json_file(AUTH_FILE)

    for acc in accounts:
        if str(acc.get("id")) == str(account_id):
            return acc

    return None

def get_candidate_profile_cv(credentials):
    token = credentials.credentials
    payload = decode_token(token)

    if not payload or "sub" not in payload:
        raise HTTPException(status_code=401, detail="Invalid token")

    account_id = payload["sub"]

    account = get_account_by_id(account_id)
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    profiles = load_json_file(PROFILE_FILE)  


    profile = None
    for p in profiles:
        if str(p.get("accountId")) == str(account_id):
            profile = p
            break


    if not profile:
        profile = {
            "accountId": account_id,
            "fullName": account["fullName"],
            "email": account["email"],
            "avatar": "",
            "jobTitle": "",
            "phoneNumber": "",
            "birthDay": None,
            "address": {
                "line": "",
                "city": "",
                "country": ""
            },
            "link": "",
            "aboutMe": "",
            "education": [],
            "workExperience": [],
            "skills": [],
            "foreignLanguages": [],
            "highlightProjects": [],
            "certificates": [],
            "awards": [],
            "createdAt": datetime.utcnow().isoformat() + "Z",
            "updatedAt": datetime.utcnow().isoformat() + "Z"
        }

        profiles.append(profile)
        save_json_file(PROFILE_FILE, profiles)


    profile["fullName"] = account["fullName"]
    profile["email"] = account["email"]

    return {
        "status": "success",
        **profile
    }
def find_profile_by_account_id(profiles: list, account_id: str):
    """
    Tìm profile theo accountId trong danh sách profiles
    """
    if not profiles:
        return None

    for profile in profiles:
        if str(profile.get("accountId")) == str(account_id):
            return profile

    return None

def update_candidate_profile_cv(data: dict, credentials):
    token = credentials.credentials
    payload = decode_token(token)

    if not payload or "sub" not in payload:
        raise HTTPException(status_code=401, detail="Invalid token")

    account_id = payload["sub"]
    account = get_account_by_id(account_id)
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    profiles = load_json_file(PROFILE_FILE)
    profile = find_profile_by_account_id(profiles, account_id)

    if not profile:
        profile = {
            "accountId": account_id,
            "fullName": account["fullName"],
            "email": account["email"],
            "avatar": "",
            "jobTitle": "",
            "phoneNumber": "",
            "birthDay": None,
            "address": {"line": "", "city": "", "country": ""},
            "link": "",
            "aboutMe": "",
            "education": [],
            "workExperience": [],
            "skills": [],
            "foreignLanguages": [],
            "highlightProjects": [],
            "certificates": [],
            "awards": [],
            "createdAt": datetime.utcnow().isoformat() + "Z",
            "updatedAt": datetime.utcnow().isoformat() + "Z"
        }
        profiles.append(profile)

    # ===== UPDATE DATA (QUAN TRỌNG) =====
    for key, value in data.items():
        if key in IMMUTABLE_FIELDS:
            continue
        profile[key] = value

    # luôn đồng bộ fullname & email từ account
    profile["fullName"] = account["fullName"]
    profile["email"] = account["email"]
    profile["updatedAt"] = datetime.utcnow().isoformat() + "Z"

    save_json_file(PROFILE_FILE, profiles)

    return {
        "status": "success",
        "message": "Profile updated successfully",
        **profile
    }