import uuid
from fastapi import HTTPException
from app.utils.json_helper import load_json_file, save_json_file
from pathlib import Path
from datetime import datetime

BASE_DIR = Path(__file__).resolve().parents[1]
DATA_FILE = BASE_DIR / "data" / "job.json"
AUTH_FILE = BASE_DIR / "data" / "auth_register.json"


def get_recruiter_by_id(recruiter_id: str):
    recruiters = load_json_file(AUTH_FILE)
    for r in recruiters:
        if str(r["id"]) == recruiter_id:
            return r
    return None


def get_company_id_by_recruiter(recruiter_id: str):
    users = load_json_file(AUTH_FILE)
    for u in users:
        if str(u.get("id")) == recruiter_id and u.get("company"):
            return u["company"]["id"]
    return None


def create_job(job, recruiter_id: int):
    company_id = get_company_id_by_recruiter(str(recruiter_id))
    if not company_id:
        raise HTTPException(status_code=400, detail="Recruiter has no company")

    now = datetime.utcnow().isoformat() + "Z"

    new_job = {
        "_id": str(uuid.uuid4()),
        "title": job.title,
        "jobTitle": job.jobTitle,
        "recruiterId": str(recruiter_id),
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

    return {"status": "success", **new_job}


def get_details_job_by_id(id: str):
    jobs = load_json_file(DATA_FILE)
    for j in jobs:
        if j["_id"] == id:
            return j
    raise HTTPException(status_code=404, detail="Job not found")


def update_job_by_id(id: str, updated_data, recruiter_id: int):
    jobs = load_json_file(DATA_FILE)
    data_update = updated_data.model_dump(exclude_unset=True)

    for index, r in enumerate(jobs):
        if r["_id"] == id:
            # (tuỳ chọn) check ownership:
            # if str(r.get("recruiterId")) != str(recruiter_id):
            #     raise HTTPException(status_code=403, detail="Not owner of this job")

            jobs[index].update(data_update)
            jobs[index]["updatedAt"] = datetime.utcnow().isoformat() + "Z"
            save_json_file(DATA_FILE, jobs)
            return {"status": "success", "message": "Job updated successfully.", **jobs[index]}

    raise HTTPException(status_code=404, detail="Job not found")


def delete_job_by_id(id: str, recruiter_id: int):
    jobs = load_json_file(DATA_FILE)

    for j in jobs:
        if j["_id"] == id:
            # (tuỳ chọn) check ownership:
            # if str(j.get("recruiterId")) != str(recruiter_id):
            #     raise HTTPException(status_code=403, detail="Not owner of this job")

            jobs.remove(j)
            save_json_file(DATA_FILE, jobs)
            return {"status": "success", "message": "Job deleted successfully."}

    raise HTTPException(status_code=404, detail="Job not found")


def get_job_of_recruiter(recruiter_id: int):
    recruiter = get_recruiter_by_id(str(recruiter_id))
    if not recruiter:
        raise HTTPException(status_code=404, detail="Recruiter not found")

    company_id = recruiter["company"]["id"]
    jobs = load_json_file(DATA_FILE)

    recruiter_jobs = []
    for j in jobs:
        if str(j.get("recruiterId")) == str(recruiter_id):
            job = j.copy()
            job["companyId"] = company_id
            job["__v"] = 0
            recruiter_jobs.append(job)

    return {"status": "success", "data": recruiter_jobs}