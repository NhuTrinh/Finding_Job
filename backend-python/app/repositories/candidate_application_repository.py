import uuid
from pathlib import Path
from datetime import datetime, timezone
from app.utils.json_helper import load_json_file, save_json_file

BASE_DIR = Path(__file__).resolve().parents[1]
DATA_FILE_APPLICATION = BASE_DIR / "data" / "application.json"
DATA_FILE_JOBS = BASE_DIR / "data" / "job.json"

class CandidateApplicationRepository:
    def __init__(self):
        self.app_file = DATA_FILE_APPLICATION
        self.job_file = DATA_FILE_JOBS

    def _now(self) -> str:
        return datetime.now(timezone.utc).isoformat().replace("+00:00","Z")

    def job_exists(self, job_id: str) -> bool:
        jobs = load_json_file(self.job_file)
        return any(j.get("_id") == job_id for j in jobs)

    def create(self, candidate_id: str, job_id: str):
        apps = load_json_file(self.app_file)
        now = self._now()
        app_item = {
            "_id": str(uuid.uuid4()),
            "candidateId": candidate_id,
            "jobId": job_id,
            "status": "pending",
            "createdAt": now,
            "updatedAt": now
        }
        apps.append(app_item)
        save_json_file(self.app_file, apps)
        return app_item

    def list_by_candidate(self, candidate_id: str):
        apps = load_json_file(self.app_file)
        return [a for a in apps if a.get("candidateId") == candidate_id]

    def withdraw(self, candidate_id: str, application_id: str):
        apps = load_json_file(self.app_file)

        # 1) tìm application theo id trước
        found_idx = None
        for i, a in enumerate(apps):
            if a.get("_id") == application_id:
                found_idx = i
                break

        if found_idx is None:
            return {"ok": False, "reason": "not_found", "data": None}

        # 2) check ownership
        if apps[found_idx].get("candidateId") != candidate_id:
            return {"ok": False, "reason": "forbidden", "data": None}

        # 3) update status
        apps[found_idx]["status"] = "withdrawn"
        apps[found_idx]["updatedAt"] = self._now()
        save_json_file(self.app_file, apps)
        return {"ok": True, "reason": "ok", "data": apps[found_idx]}
