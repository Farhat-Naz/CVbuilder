from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from app.core.config import settings
from app.api.v1.router import api_router
import logging

logger = logging.getLogger(__name__)

limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="CVGenerator API",
    description="AI-powered Resume Builder API",
    version="1.0.0",
    docs_url="/docs" if settings.ENVIRONMENT != "production" else None,
    redoc_url="/redoc" if settings.ENVIRONMENT != "production" else None,
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:3000"],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)


@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "1.0.0"}


@app.get("/test-register")
async def test_register():
    try:
        from app.database.base import SessionLocal
        from app.models.user import User
        from app.auth.password import hash_password
        import uuid
        db = SessionLocal()
        test_user = User(
            email=f"debug_{uuid.uuid4().hex[:6]}@test.com",
            full_name="Debug User",
            hashed_password=hash_password("Test123456"),
        )
        db.add(test_user)
        db.commit()
        db.refresh(test_user)
        db.delete(test_user)
        db.commit()
        db.close()
        return {"result": "success", "message": "Registration works!"}
    except Exception as e:
        import traceback
        return {"result": "failed", "error": str(e), "trace": traceback.format_exc()}


@app.get("/db-check")
async def db_check():
    try:
        from app.database.base import engine, Base
        from app.models import User, Resume, CoverLetter, Template
        from sqlalchemy import text, inspect
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        Base.metadata.create_all(bind=engine)
        return {"db": "connected", "tables": tables}
    except Exception as e:
        return {"db": "failed", "error": str(e)}


try:
    from app.database.base import Base, engine
    from app.models import User, Resume, CoverLetter, Template
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created/verified.")
except Exception as e:
    logger.warning(f"Database init failed: {e}")
