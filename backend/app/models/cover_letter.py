from sqlalchemy import Column, String, Boolean, DateTime, Text, ForeignKey, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
import enum
from app.database.base import Base


class ToneType(str, enum.Enum):
    PROFESSIONAL = "professional"
    FRIENDLY = "friendly"
    ENTHUSIASTIC = "enthusiastic"
    FORMAL = "formal"
    CONVERSATIONAL = "conversational"


class ExperienceLevel(str, enum.Enum):
    ENTRY = "entry"
    MID = "mid"
    SENIOR = "senior"
    EXECUTIVE = "executive"


class CoverLetter(Base):
    __tablename__ = "cover_letters"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False, default="My Cover Letter")
    company_name = Column(String(255), nullable=True)
    hiring_manager = Column(String(255), nullable=True)
    job_title = Column(String(255), nullable=True)
    job_description = Column(Text, nullable=True)
    tone = Column(Enum(ToneType), default=ToneType.PROFESSIONAL)
    experience_level = Column(Enum(ExperienceLevel), default=ExperienceLevel.MID)
    content = Column(Text, nullable=True)
    is_public = Column(Boolean, default=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="cover_letters")
