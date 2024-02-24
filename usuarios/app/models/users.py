from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class UserCreate(BaseModel):
    fullname: str = Field(...)
    email: EmailStr = Field(...)
    city: str = Field(...)
    phoneNumber: int = Field(..., gt=0)
    birthday: str = Field(...)
    telegram_id: Optional[int] = Field(None, gt=0)
    password: str = Field(...)
    registration_number: Optional[int] = Field(None, gt=1)

    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    fullname: Optional[str]
    city: Optional[str]
    phoneNumber: Optional[int] = Field(..., gt=0)
    birthday: Optional[str]
    telegram_id: Optional[int] = Field(None, gt=0)
    password: Optional[str]
    registration_number: Optional[int] = Field(None, gt=1)

    class Config:
        from_attributes = True


class UserResponse(BaseModel):
    fullname: str = Field(...)
    email: EmailStr = Field(...)
    city: str = Field(...)
    id: str = Field(...)
    phoneNumber: int = Field(..., gt=0)
    birthday: str = Field(...)
    register_date: str = Field(...)
    telegram_id: Optional[int] = Field(None, gt=0)
    registration_number: Optional[int] = Field(None, gt=1)

    class Config:
        from_attributes = True
