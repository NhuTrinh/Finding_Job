from app.repositories.user_repository import JsonRepository
from fastapi import HTTPException
repo = JsonRepository()


class JobService:

    @staticmethod
    def apply_job(user, job_id: str):
        if user["role"] != "candidate":
            raise HTTPException(status_code=403, detail="Only candidates can apply for jobs.")
        job = next((j for j in repo.get_jobs() if j["id"] == job_id), None)

        if not job:
            raise HTTPException(status_code=404, detail="Job not found")
        return repo.create_application(user["id"], job_id)
    existing = repo.get_user_applications(user["id"])
    if any(a["job_id"] == job_id for a in existing):
        raise HTTPException(status_code=400, detail="Already applied")

    @staticmethod
    def get_my_applications(user):
        return repo.get_user_applications(user["id"])