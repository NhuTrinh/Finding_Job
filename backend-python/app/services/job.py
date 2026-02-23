import uuid
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.utils.json_helper import load_json_file, save_json_file
from app.utils.security import hash_password, verify_password, create_access_token, decode_token
from pathlib import Path
from datetime import datetime

BASE_DIR = Path(__file__).resolve().parents[1]
DATA_FILE = BASE_DIR / "data" / "job.json"
AUTH_FILE = BASE_DIR / "data" / "auth_register.json"
security = HTTPBearer()

def get_all_jobs():
    return load_json_file(DATA_FILE)

def get_recruiter_by_id(recruiter_id: str):
    recruiters = load_json_file(AUTH_FILE)

    for r in recruiters:
        if str(r["id"]) == recruiter_id:
            return r

    return None

def get_company_id_by_recruiter(recruiter_id: str):
    users = load_json_file(AUTH_FILE)
    for u in users:
        if str(u.get("id")) == recruiter_id:
            return u["company"]["id"]
    return None

def create_job(job, credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = decode_token(token)

    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")

    recruiter_id = payload["id"]
    company_id = get_company_id_by_recruiter(recruiter_id)

    if not company_id:
        raise HTTPException(status_code=400, detail="Recruiter has no company")

    now = datetime.utcnow().isoformat() + "Z"

    new_job = {
        "_id": str(uuid.uuid4()),
        "title": job.title,
        "jobTitle": job.jobTitle,
        "recruiterId": recruiter_id,
        "companyId": company_id,
        "salaryMin": job.salaryMin,
        "salaryMax": job.salaryMax,
        "address": job.address.dict(),
        "employmentType": job.employmentType,
        "skills": job.skills,
        "jobExpertise": job.jobExpertise,
        "jobDomain": job.jobDomain,
        "description": job.description,
        "createdAt": now,
        "updatedAt": now
    }

    jobs = load_json_file(DATA_FILE)
    jobs.append(new_job)
    save_json_file(DATA_FILE, jobs)

    return {
        "status": "success",
        **new_job
    }

def get_details_job_by_id(id):
    
    jobs = load_json_file(DATA_FILE)
    
    for j in jobs:
        if j['_id'] == id:
            return j
        

def update_job_by_id(id, updated_data, credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = decode_token(token)

    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    jobs = load_json_file(DATA_FILE)
    
    data_update = updated_data.model_dump(exclude_unset=True)

    for index, r in enumerate(jobs):
        if r['_id'] == id:

            jobs[index].update(data_update)

            save_json_file(DATA_FILE, jobs)

            return {
                'status': 'success',
                'message': 'Job updated successfully.',
                **jobs[index]
            }

    raise HTTPException(status_code=404, detail="Job not found")


def delete_job_by_id(id, credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = decode_token(token)

    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    jobs = load_json_file(DATA_FILE)

    for j in jobs:
        if j['_id'] == id:
            jobs.remove(j)
            save_json_file(DATA_FILE, jobs)
            return {
                'status': 'success',
                'message': 'Job deleted successfully.',
            }
        

def get_job_of_recruiter(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials
    payload = decode_token(token)

    if not payload or "id" not in payload:
        raise HTTPException(status_code=401, detail="Invalid token")

    recruiter_id = str(payload["id"])

    recruiter = get_recruiter_by_id(recruiter_id)
    if not recruiter:
        raise HTTPException(status_code=404, detail="Recruiter not found")

    company_id = recruiter["company"]["id"]

    jobs = load_json_file(DATA_FILE)

    recruiter_jobs = []
    for j in jobs:
        if str(j.get("recruiterId")) == recruiter_id:
            job = j.copy()
            job["_id"] = job.pop("_id")
            job["companyId"] = company_id
            job["createdAt"] = job.get("createdAt", None)
            job["updatedAt"] = job.get("updatedAt", None)
            job["__v"] = 0

            recruiter_jobs.append(job)

    return {
        "status": "success",
        "data": recruiter_jobs
    }