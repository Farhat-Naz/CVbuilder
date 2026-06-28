from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import uuid
from app.database.base import get_db
from app.models.cover_letter import CoverLetter
from app.models.user import User
from app.schemas.cover_letter import CoverLetterCreate, CoverLetterUpdate, CoverLetterResponse, GenerateCoverLetterRequest
from app.auth.jwt import get_current_active_user
from app.services.ai_service import generate_cover_letter_ai

router = APIRouter(prefix="/cover-letters", tags=["Cover Letters"])


def check_cover_letter_limit(user: User, db: Session):
    if user.subscription_plan == "free":
        count = db.query(CoverLetter).filter(CoverLetter.user_id == user.id).count()
        if count >= 5:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Free plan allows maximum 5 cover letters. Upgrade to Pro."
            )


@router.get("/", response_model=List[CoverLetterResponse])
async def list_cover_letters(current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    return db.query(CoverLetter).filter(CoverLetter.user_id == current_user.id).all()


@router.post("/", response_model=CoverLetterResponse, status_code=status.HTTP_201_CREATED)
async def create_cover_letter(
    data: CoverLetterCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    check_cover_letter_limit(current_user, db)
    cl = CoverLetter(user_id=current_user.id, **data.model_dump(exclude_unset=True))
    db.add(cl)
    db.commit()
    db.refresh(cl)
    return cl


@router.get("/{cl_id}", response_model=CoverLetterResponse)
async def get_cover_letter(
    cl_id: uuid.UUID,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    cl = db.query(CoverLetter).filter(CoverLetter.id == cl_id, CoverLetter.user_id == current_user.id).first()
    if not cl:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cover letter not found")
    return cl


@router.put("/{cl_id}", response_model=CoverLetterResponse)
async def update_cover_letter(
    cl_id: uuid.UUID,
    data: CoverLetterUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    cl = db.query(CoverLetter).filter(CoverLetter.id == cl_id, CoverLetter.user_id == current_user.id).first()
    if not cl:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cover letter not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(cl, field, value)
    db.commit()
    db.refresh(cl)
    return cl


@router.delete("/{cl_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_cover_letter(
    cl_id: uuid.UUID,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    cl = db.query(CoverLetter).filter(CoverLetter.id == cl_id, CoverLetter.user_id == current_user.id).first()
    if not cl:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cover letter not found")
    db.delete(cl)
    db.commit()


@router.post("/generate", response_model=dict)
async def generate_cover_letter(
    data: GenerateCoverLetterRequest,
    current_user: User = Depends(get_current_active_user),
):
    content = await generate_cover_letter_ai(data)
    return {"content": content}
