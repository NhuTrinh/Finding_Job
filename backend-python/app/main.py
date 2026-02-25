from fastapi import FastAPI
from app.routers import auth_recruiter
from app.routers import applications
from app.routers import recruiter
from app.routers import company
from app.routers import job
from app.routers import candidate_profile
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth_candidate, candidate, candidate_applications

app = FastAPI(title = "My FastAPI Application", 
              version = "1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_recruiter.router)
app.include_router(applications.router)
app.include_router(recruiter.router)
app.include_router(company.router)
app.include_router(job.router)

app.include_router(auth_candidate.router)
app.include_router(candidate.router)
app.include_router(candidate_applications.router)
app.include_router(candidate_profile.router)

@app.get("/health")
def health_check():
    return {"status": "healthy"}