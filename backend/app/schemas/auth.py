from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class RegisterRequest(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=255)
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(None, pattern=r"^\+?\d{10,15}$")
    password: str = Field(..., min_length=8, max_length=128)
    role: str = "cashier"


class LoginRequest(BaseModel):
    identifier: str = Field(..., description="Email or phone number")
    password: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshRequest(BaseModel):
    refresh_token: str


class UserResponse(BaseModel):
    id: str
    full_name: str
    email: Optional[str]
    phone: Optional[str]
    role: str
    is_active: bool

    class Config:
        from_attributes = True
