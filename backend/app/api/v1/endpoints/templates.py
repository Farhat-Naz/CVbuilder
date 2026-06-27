from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.base import get_db
from app.models.template import Template
from app.auth.jwt import get_current_active_user, require_admin
from app.models.user import User

router = APIRouter(prefix="/templates", tags=["Templates"])

BUILT_IN_TEMPLATES = [
    {"id": "classic", "name": "Classic Professional", "category": "ATS Professional", "is_premium": False, "tags": ["ats", "professional", "clean"]},
    {"id": "modern", "name": "Modern Clean", "category": "Modern", "is_premium": False, "tags": ["modern", "clean", "minimal"]},
    {"id": "minimal", "name": "Minimal White", "category": "Minimal", "is_premium": False, "tags": ["minimal", "white", "simple"]},
    {"id": "elegant", "name": "Elegant Dark", "category": "Elegant", "is_premium": True, "tags": ["elegant", "dark", "premium"]},
    {"id": "creative", "name": "Creative Colorful", "category": "Creative", "is_premium": True, "tags": ["creative", "colorful", "design"]},
    {"id": "executive", "name": "Executive Blue", "category": "Executive", "is_premium": True, "tags": ["executive", "blue", "corporate"]},
    {"id": "developer", "name": "Developer Tech", "category": "Modern", "is_premium": False, "tags": ["developer", "tech", "coding"]},
    {"id": "designer", "name": "Designer Portfolio", "category": "Creative", "is_premium": True, "tags": ["designer", "portfolio", "creative"]},
    {"id": "marketing", "name": "Marketing Pro", "category": "Corporate", "is_premium": True, "tags": ["marketing", "professional"]},
    {"id": "student", "name": "Student Simple", "category": "Minimal", "is_premium": False, "tags": ["student", "entry-level", "simple"]},
    {"id": "internship", "name": "Internship Ready", "category": "Minimal", "is_premium": False, "tags": ["internship", "student"]},
    {"id": "academic", "name": "Academic CV", "category": "ATS Professional", "is_premium": False, "tags": ["academic", "cv", "research"]},
    {"id": "corporate", "name": "Corporate Standard", "category": "Corporate", "is_premium": True, "tags": ["corporate", "standard"]},
    {"id": "healthcare", "name": "Healthcare Professional", "category": "ATS Professional", "is_premium": True, "tags": ["healthcare", "medical"]},
    {"id": "finance", "name": "Finance Executive", "category": "Executive", "is_premium": True, "tags": ["finance", "banking"]},
    {"id": "engineering", "name": "Engineering Precise", "category": "ATS Professional", "is_premium": False, "tags": ["engineering", "technical"]},
    {"id": "government", "name": "Government Federal", "category": "ATS Professional", "is_premium": False, "tags": ["government", "federal"]},
    {"id": "freelancer", "name": "Freelancer Portfolio", "category": "Creative", "is_premium": True, "tags": ["freelancer", "portfolio"]},
    {"id": "remote", "name": "Remote Work Ready", "category": "Modern", "is_premium": False, "tags": ["remote", "digital", "modern"]},
    {"id": "international", "name": "International Format", "category": "ATS Professional", "is_premium": True, "tags": ["international", "global"]},
    {"id": "two-column", "name": "Two Column Modern", "category": "Modern", "is_premium": True, "tags": ["two-column", "modern"]},
    {"id": "sidebar", "name": "Sidebar Accent", "category": "Creative", "is_premium": True, "tags": ["sidebar", "accent"]},
    {"id": "infographic", "name": "Infographic Visual", "category": "Creative", "is_premium": True, "tags": ["infographic", "visual"]},
    {"id": "timeline", "name": "Timeline Format", "category": "Modern", "is_premium": True, "tags": ["timeline", "chronological"]},
    {"id": "compact", "name": "Compact One Page", "category": "Minimal", "is_premium": False, "tags": ["compact", "one-page", "ats"]},
]


@router.get("/")
async def list_templates(
    category: Optional[str] = None,
    is_premium: Optional[bool] = None,
    search: Optional[str] = None,
):
    templates = BUILT_IN_TEMPLATES
    if category:
        templates = [t for t in templates if t["category"].lower() == category.lower()]
    if is_premium is not None:
        templates = [t for t in templates if t["is_premium"] == is_premium]
    if search:
        search_lower = search.lower()
        templates = [t for t in templates if search_lower in t["name"].lower() or any(search_lower in tag for tag in t["tags"])]
    return templates


@router.get("/{template_id}")
async def get_template(template_id: str):
    template = next((t for t in BUILT_IN_TEMPLATES if t["id"] == template_id), None)
    if not template:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Template not found")
    return template
