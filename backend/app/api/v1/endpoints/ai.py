from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from app.models.user import User
from app.auth.jwt import get_current_active_user
from app.services.ai_service import (
    generate_summary,
    rewrite_resume,
    check_ats_score,
    fix_grammar,
    optimize_keywords,
    generate_bullets,
    suggest_skills,
)

router = APIRouter(prefix="/ai", tags=["AI Features"])


class SummaryRequest(BaseModel):
    job_title: str
    experience_years: int
    skills: List[str]
    industry: Optional[str] = None


class RewriteRequest(BaseModel):
    content: str
    tone: str = "professional"


class ATSRequest(BaseModel):
    resume_text: str
    job_description: Optional[str] = None


class GrammarRequest(BaseModel):
    text: str


class KeywordRequest(BaseModel):
    resume_text: str
    job_description: str


class BulletRequest(BaseModel):
    job_title: str
    company: str
    responsibilities: str


class SkillRequest(BaseModel):
    job_title: str
    current_skills: List[str] = []


@router.post("/generate-summary")
async def ai_generate_summary(data: SummaryRequest, current_user: User = Depends(get_current_active_user)):
    result = await generate_summary(data.job_title, data.experience_years, data.skills, data.industry)
    return {"summary": result}


@router.post("/rewrite")
async def ai_rewrite(data: RewriteRequest, current_user: User = Depends(get_current_active_user)):
    result = await rewrite_resume(data.content, data.tone)
    return {"content": result}


@router.post("/ats-score")
async def ai_ats_score(data: ATSRequest, current_user: User = Depends(get_current_active_user)):
    result = await check_ats_score(data.resume_text, data.job_description)
    return result


@router.post("/fix-grammar")
async def ai_fix_grammar(data: GrammarRequest, current_user: User = Depends(get_current_active_user)):
    result = await fix_grammar(data.text)
    return {"text": result}


@router.post("/optimize-keywords")
async def ai_optimize_keywords(data: KeywordRequest, current_user: User = Depends(get_current_active_user)):
    result = await optimize_keywords(data.resume_text, data.job_description)
    return result


@router.post("/generate-bullets")
async def ai_generate_bullets(data: BulletRequest, current_user: User = Depends(get_current_active_user)):
    result = await generate_bullets(data.job_title, data.company, data.responsibilities)
    return {"bullets": result}


@router.post("/suggest-skills")
async def ai_suggest_skills(data: SkillRequest, current_user: User = Depends(get_current_active_user)):
    result = await suggest_skills(data.job_title, data.current_skills)
    return {"skills": result}
