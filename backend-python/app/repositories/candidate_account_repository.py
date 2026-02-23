import uuid
from pathlib import Path
from datetime import datetime, timezone
from app.utils.json_helper import load_json_file, save_json_file

BASE_DIR = Path(__file__).resolve().parents[1]
DATA_FILE = BASE_DIR / "data" / "candidate_accounts.json"
PUBLIC_FILE = BASE_DIR / "data" / "candidate.json"

class CandidateAccountRepository:
    def __init__(self):
        self.data_file = DATA_FILE
        self.public_file = PUBLIC_FILE

    def _now(self) -> str:
        return datetime.now(timezone.utc).isoformat().replace("+00:00","Z")

    def find_by_email(self, email: str):
        accounts = load_json_file(self.data_file)
        return next((a for a in accounts if a.get("email") == email), None)

    def find_by_id(self, account_id: str):
        accounts = load_json_file(self.data_file)
        return next((a for a in accounts if a.get("id") == account_id), None)

    def create(self, full_name: str, email: str, password_hash: str):
        accounts = load_json_file(self.data_file)
        account_id = str(uuid.uuid4())
        now = self._now()

        account = {
            "id": account_id,
            "fullName": full_name,
            "email": email,
            "password": password_hash,
            "role": "candidate",
            "createdAt": now,
            "updatedAt": now
        }
        accounts.append(account)
        save_json_file(self.data_file, accounts)

        # keep recruiter-side joins working (candidate.json has no password)
        public = load_json_file(self.public_file)
        if not any(c.get("id") == account_id for c in public):
            public.append({
                "id": account_id,
                "fullName": full_name,
                "email": email,
                "role": "candidate"
            })
            save_json_file(self.public_file, public)

        return account
