from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.database import get_db
from app.models.user import User
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse, RefreshRequest, UserResponse
from app.utils.security import (
    hash_password, verify_password,
    create_access_token, create_refresh_token, decode_token,
    get_current_user,
)
from app.config import settings

router = APIRouter()


@router.post("/register", response_model=TokenResponse, status_code=201)
def register(body: RegisterRequest, db: Session = Depends(get_db)):
    if not body.email and not body.phone:
        raise HTTPException(400, "Email or phone is required")

    existing = db.query(User).filter(
        or_(
            User.email == body.email if body.email else False,
            User.phone == body.phone if body.phone else False,
        )
    ).first()
    if existing:
        raise HTTPException(409, "User already exists")

    user = User(
        full_name=body.full_name,
        email=body.email,
        phone=body.phone,
        password_hash=hash_password(body.password),
        role=body.role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    return TokenResponse(
        access_token=create_access_token(user.id, user.role.value),
        refresh_token=create_refresh_token(user.id),
    )


@router.post("/login", response_model=TokenResponse)
def login(body: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(
        or_(User.email == body.identifier, User.phone == body.identifier)
    ).first()

    if not user or not verify_password(body.password, user.password_hash):
        raise HTTPException(401, "Invalid credentials")

    if not user.is_active:
        raise HTTPException(403, "Account disabled")

    return TokenResponse(
        access_token=create_access_token(user.id, user.role.value),
        refresh_token=create_refresh_token(user.id),
    )


@router.post("/refresh", response_model=TokenResponse)
def refresh(body: RefreshRequest, db: Session = Depends(get_db)):
    payload = decode_token(body.refresh_token)
    if payload.get("type") != "refresh":
        raise HTTPException(401, "Invalid token type")

    user = db.query(User).filter(User.id == payload["sub"]).first()
    if not user or not user.is_active:
        raise HTTPException(401, "User not found")

    return TokenResponse(
        access_token=create_access_token(user.id, user.role.value),
        refresh_token=create_refresh_token(user.id),
    )


@router.post("/logout")
def logout():
    # Stateless JWT — client discards tokens
    return {"message": "Logged out"}


@router.get("/me", response_model=UserResponse)
def me(user: User = Depends(get_current_user)):
    return user


# === OTP Placeholder (disabled by feature flag) ===

@router.post("/otp/request")
def otp_request():
    if not settings.FEATURE_OTP_ENABLED:
        raise HTTPException(501, "OTP currently disabled.")
    return {"message": "OTP sent"}


@router.post("/otp/verify")
def otp_verify():
    if not settings.FEATURE_OTP_ENABLED:
        raise HTTPException(501, "OTP currently disabled.")
    return {"message": "OTP verified"}
