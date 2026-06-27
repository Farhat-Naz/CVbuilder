from fastapi import APIRouter
from app.api.v1.endpoints import auth, users, resumes, cover_letters, ai, templates

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(resumes.router)
api_router.include_router(cover_letters.router)
api_router.include_router(ai.router)
api_router.include_router(templates.router)
