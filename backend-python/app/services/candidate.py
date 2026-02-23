from app.repositories.candidate_account_repository import CandidateAccountRepository
from app.repositories.candidate_profile_repository import CandidateProfileRepository

class CandidateService:
    def __init__(self):
        self.accounts = CandidateAccountRepository()
        self.profiles = CandidateProfileRepository()

    def get_me(self, current_user: dict):
        account_id = current_user["user_id"]
        account = self.accounts.find_by_id(account_id)
        if not account:
            return {"status": "error", "message": "Candidate not found."}
        profile = self.profiles.get_by_account_id(account_id)
        if not profile:
            # create default profile if missing
            profile = self.profiles.upsert(account_id, account["email"], account["fullName"], patch={})
        return profile

    def update_me(self, current_user: dict, patch: dict):
        account_id = current_user["user_id"]
        account = self.accounts.find_by_id(account_id)
        if not account:
            return {"status": "error", "message": "Candidate not found."}
        profile = self.profiles.upsert(account_id, account["email"], account["fullName"], patch=patch)
        return profile
    
