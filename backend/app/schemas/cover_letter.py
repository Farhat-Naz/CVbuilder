from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import uuid


class CoverLetterCreate(BaseModel):
    title: str = "My Cover Letter"
    company_name: Optional[str] = None
    hiring_manager: Optional[str] = None
    job_title: Optional[str] = None
    job_description: Optional[str] = None
    tone: str = "professional"
    experience_level: str = "mid"
    content: Optional[str] = None


class CoverLetterUpdate(BaseModel):
    title: Optional[str] = None
    company_name: Optional[str] = None
    hiring_manager: Optional[str] = None
    job_title: Optional[str] = None
    job_description: Optional[str] = None
    tone: Optional[str] = None
    experience_level: Optional[str] = None
    content: Optional[str] = None


class CoverLetterResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    title: str
    company_name: Optional[str]
    hiring_manager: Optional[str]
    job_title: Optional[str]
    job_description: Optional[str]
    tone: str
    experience_level: str
    content: Optional[str]
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


class GenerateCoverLetterRequest(BaseModel):
    company_name: str
    hiring_manager: Optional[str] = None
    job_title: str
    job_description: str
    tone: str = "professional"
    experience_level: str = "mid"
    user_background: Optional[str] = None
