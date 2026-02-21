from fastapi import FastAPI
from app.routers import auth_router, user_router, job_router, application_router

app = FastAPI(title="Job Finding API")

app.include_router(auth_router.router)
app.include_router(user_router.router)
app.include_router(job_router.router)
app.include_router(application_router.router)