from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
import uuid


class WorkExperience(BaseModel):
    id: Optional[str] = None
    company: str
    position: str
    location: Optional[str] = None
    start_date: str
    end_date: Optional[str] = None
    is_current: bool = False
    description: Optional[str] = None
    bullets: List[str] = []


class Education(BaseModel):
    id: Optional[str] = None
    institution: str
    degree: str
    field: Optional[str] = None
    location: Optional[str] = None
    start_date: str
    end_date: Optional[str] = None
    gpa: Optional[str] = None
    achievements: List[str] = []


class Project(BaseModel):
    id: Optional[str] = None
    name: str
    description: Optional[str] = None
    technologies: List[str] = []
    url: Optional[str] = None
    github_url: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None


class Certification(BaseModel):
    id: Optional[str] = None
    name: str
    issuer: str
    date: Optional[str] = None
    expiry: Optional[str] = None
    credential_id: Optional[str] = None
    url: Optional[str] = None


class Achievement(BaseModel):
    id: Optional[str] = None
    title: str
    description: Optional[str] = None
    date: Optional[str] = None


class Reference(BaseModel):
    id: Optional[str] = None
    name: str
    title: str
    company: str
    email: Optional[str] = None
    phone: Optional[str] = None


class Skills(BaseModel):
    technical: List[str] = []
    soft: List[str] = []
    languages: List[str] = []


class ResumeCreate(BaseModel):
    title: str = "My Resume"
    template_id: Optional[str] = "classic"
    full_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    linkedin: Optional[str] = None
    portfolio: Optional[str] = None
    github: Optional[str] = None
    summary: Optional[str] = None
    experience: List[WorkExperience] = []
    education: List[Education] = []
    skills: Skills = Field(default_factory=Skills)
    projects: List[Project] = []
    certifications: List[Certification] = []
    achievements: List[Achievement] = []
    references: List[Reference] = []


class ResumeUpdate(ResumeCreate):
    title: Optional[str] = None


class ResumeResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    title: str
    template_id: Optional[str]
    full_name: Optional[str]
    email: Optional[str]
    phone: Optional[str]
    location: Optional[str]
    linkedin: Optional[str]
    portfolio: Optional[str]
    github: Optional[str]
    summary: Optional[str]
    experience: List[Dict[str, Any]]
    education: List[Dict[str, Any]]
    skills: Dict[str, Any]
    projects: List[Dict[str, Any]]
    certifications: List[Dict[str, Any]]
    achievements: List[Dict[str, Any]]
    references: List[Dict[str, Any]]
    ats_score: Optional[int]
    view_count: int
    download_count: int
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True
