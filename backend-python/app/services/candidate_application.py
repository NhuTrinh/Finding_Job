from fastapi import HTTPException, status
from app.repositories.candidate_application_repository import CandidateApplicationRepository
from app.utils.json_helper import load_json_file
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[1]
DATA_FILE_JOBS = BASE_DIR / "data" / "job.json"

class CandidateApplicationService:
    def __init__(self):
        self.repo = CandidateApplicationRepository()

    def apply(self, current_user: dict, job_id: str):
        candidate_id = current_user["user_id"]
        if not self.repo.job_exists(job_id):
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
        return {"status": "success", "data": self.repo.create(candidate_id, job_id)}

    def my_applications(self, current_user: dict):
        candidate_id = current_user["user_id"]
        return {"status": "success", "data": self.repo.list_by_candidate(candidate_id)}

    def withdraw(self, current_user: dict, application_id: str):
        candidate_id = current_user["user_id"]
        result = self.repo.withdraw(candidate_id, application_id)

        if not result["ok"]:
            if result["reason"] == "not_found":
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")
            if result["reason"] == "forbidden":
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not allowed to withdraw this application")

        return {"status": "success", "data": result["data"]}
