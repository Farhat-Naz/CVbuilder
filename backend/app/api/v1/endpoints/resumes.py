from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import uuid
from app.database.base import get_db
from app.models.resume import Resume
from app.models.user import User
from app.schemas.resume import ResumeCreate, ResumeUpdate, ResumeResponse
from app.auth.jwt import get_current_active_user

router = APIRouter(prefix="/resumes", tags=["Resumes"])


def check_resume_limit(user: User, db: Session):
    if user.subscription_plan == "free":
        count = db.query(Resume).filter(Resume.user_id == user.id).count()
        if count >= 2:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Free plan allows maximum 2 resumes. Upgrade to Pro for unlimited."
            )


@router.get("/", response_model=List[ResumeResponse])
async def list_resumes(current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    return db.query(Resume).filter(Resume.user_id == current_user.id).all()


@router.post("/", response_model=ResumeResponse, status_code=status.HTTP_201_CREATED)
async def create_resume(
    data: ResumeCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    check_resume_limit(current_user, db)
    resume = Resume(
        user_id=current_user.id,
        **data.model_dump(exclude_unset=True)
    )
    db.add(resume)
    db.commit()
    db.refresh(resume)
    return resume


@router.get("/{resume_id}", response_model=ResumeResponse)
async def get_resume(
    resume_id: uuid.UUID,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")
    return resume


@router.put("/{resume_id}", response_model=ResumeResponse)
async def update_resume(
    resume_id: uuid.UUID,
    data: ResumeUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(resume, field, value)
    db.commit()
    db.refresh(resume)
    return resume


@router.delete("/{resume_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_resume(
    resume_id: uuid.UUID,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")
    db.delete(resume)
    db.commit()


@router.post("/{resume_id}/duplicate", response_model=ResumeResponse)
async def duplicate_resume(
    resume_id: uuid.UUID,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    check_resume_limit(current_user, db)
    original = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()
    if not original:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")

    new_resume = Resume(
        user_id=current_user.id,
        title=f"{original.title} (Copy)",
        template_id=original.template_id,
        full_name=original.full_name,
        email=original.email,
        phone=original.phone,
        location=original.location,
        linkedin=original.linkedin,
        portfolio=original.portfolio,
        github=original.github,
        summary=original.summary,
        experience=original.experience,
        education=original.education,
        skills=original.skills,
        projects=original.projects,
        certifications=original.certifications,
        achievements=original.achievements,
        references=original.references,
    )
    db.add(new_resume)
    db.commit()
    db.refresh(new_resume)
    return new_resume
