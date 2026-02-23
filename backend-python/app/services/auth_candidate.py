from fastapi import HTTPException, status
from app.schemas.Candidate import CandidateRegister, CandidateLogin
from app.repositories.candidate_account_repository import CandidateAccountRepository
from app.repositories.candidate_profile_repository import CandidateProfileRepository
from app.core.security import hash_password, verify_password, create_access_token

class AuthCandidateService:
    def __init__(self):
        self.accounts = CandidateAccountRepository()
        self.profiles = CandidateProfileRepository()

    def register(self, data: CandidateRegister):
        existing = self.accounts.find_by_email(data.email)
        if existing:
            return {"status": "error", "message": "Candidate already registered."}

        pwd_hash = hash_password(data.password)
        account = self.accounts.create(full_name=data.fullName, email=str(data.email), password_hash=pwd_hash)

        # ensure profile exists
        self.profiles.upsert(account_id=account["id"], email=account["email"], full_name=account["fullName"], patch={})

        return {"status": "success", "message": "Candidate registered successfully."}

    def login(self, data: CandidateLogin):
        account = self.accounts.find_by_email(str(data.email))
        if not account or not verify_password(data.password, account["password"]):
            return {"status": "error", "message": "Invalid email or password."}

        token = create_access_token(user_id=account["id"], role=account["role"])
        public_candidate = {"id": account["id"], "fullName": account["fullName"], "email": account["email"], "role": account["role"]}
        return {"status": "success", "message": "Login successful.", "candidate": public_candidate, "token": token}
