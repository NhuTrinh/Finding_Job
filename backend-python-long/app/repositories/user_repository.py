import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DB_PATH = BASE_DIR / "data" / "fake_db.json"


class UserRepository:

    def _load(self):
        with open(DB_PATH, "r", encoding="utf-8") as f:
            return json.load(f)

    def _save(self, data):
        with open(DB_PATH, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=4)

    def find_user_by_email(self, email: str):
        db = self._load()
        return next((u for u in db["users"] if u["email"] == email), None)

    def find_user_by_id(self, user_id: str):
        db = self._load()
        return next((u for u in db["users"] if u["id"] == user_id), None)

    def create_user(self, user_data: dict):
        db = self._load()

        new_user = {
            "id": f"u{len(db['users']) + 1}",
            "name": user_data["name"],
            "email": user_data["email"],
            "password": user_data["password"],
            "role": user_data["role"]
        }

        db["users"].append(new_user)
        self._save(db)

        return new_user