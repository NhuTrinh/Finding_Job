from pathlib import Path
from datetime import datetime, timezone
from app.utils.json_helper import load_json_file, save_json_file

BASE_DIR = Path(__file__).resolve().parents[1]
DATA_FILE = BASE_DIR / "data" / "profile.json"

class CandidateProfileRepository:
    def __init__(self):
        self.data_file = DATA_FILE

    def _now(self) -> str:
        return datetime.now(timezone.utc).isoformat().replace("+00:00","Z")

    def get_by_account_id(self, account_id: str):
        profiles = load_json_file(self.data_file)
        return next((p for p in profiles if p.get("accountId") == account_id), None)

    def upsert(self, account_id: str, email: str, full_name: str, patch: dict):
        profiles = load_json_file(self.data_file)
        now = self._now()
        idx = next((i for i,p in enumerate(profiles) if p.get("accountId") == account_id), None)

        if idx is None:
            profile = {
                
                "accountId": account_id,
                "fullName": full_name,
                "email": email,
                "avatar": "",
                "jobTitle": "",
                "phoneNumber": "",
                "birthDay": "",
                "address": {"line":"", "city":"", "country":""},
                "link": "",
                "aboutMe": "",
                "education": [],
                "workExperience": [],
                "skills": [],
                "projects": [],
                "certificates": [],
                "languages": [],
                "interests": [],
                "createdAt": now,
                "updatedAt": now
            }
            profiles.append(profile)
            save_json_file(self.data_file, profiles)
            idx = len(profiles)-1

        profile = profiles[idx]
        # apply patch
        for k,v in patch.items():
            if v is None:
                continue
            if k == "address" and isinstance(v, dict):
                profile["address"] = v
            else:
                profile[k] = v
        profile["updatedAt"] = now
        profiles[idx] = profile
        save_json_file(self.data_file, profiles)
        return profile
