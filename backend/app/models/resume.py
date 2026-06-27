from sqlalchemy import Column, String, Boolean, DateTime, Text, Integer, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from app.database.base import Base


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False, default="My Resume")
    template_id = Column(String(100), nullable=True)
    is_public = Column(Boolean, default=False)

    # Personal Info
    full_name = Column(String(255), nullable=True)
    email = Column(String(255), nullable=True)
    phone = Column(String(50), nullable=True)
    location = Column(String(255), nullable=True)
    linkedin = Column(String(255), nullable=True)
    portfolio = Column(String(255), nullable=True)
    github = Column(String(255), nullable=True)
    summary = Column(Text, nullable=True)

    # JSON fields for dynamic sections
    experience = Column(JSON, default=list)
    education = Column(JSON, default=list)
    skills = Column(JSON, default=dict)
    projects = Column(JSON, default=list)
    certifications = Column(JSON, default=list)
    achievements = Column(JSON, default=list)
    references = Column(JSON, default=list)
    custom_sections = Column(JSON, default=list)

    # Metadata
    ats_score = Column(Integer, nullable=True)
    view_count = Column(Integer, default=0)
    download_count = Column(Integer, default=0)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="resumes")
