from fastapi import APIRouter
from app.schemas.Candidate import CandidateRegister, CandidateLogin
from app.services.auth_candidate import AuthCandidateService

router = APIRouter(prefix="/api/v1/accounts/candidate", tags=["Candidate Authentication"])
svc = AuthCandidateService()

@router.post("/register", summary="Register candidate", description="Create a new candidate account")
def register_candidate(data: CandidateRegister):
    return svc.register(data)

@router.post("/login", summary="Login candidate", description="Login candidate and return token")
def login_candidate(data: CandidateLogin):
    return svc.login(data)
