from enum import IntEnum
from typing import Optional
from pydantic import BaseModel

class UserRole(IntEnum):
    admin = 0
    user = 1

class UserBase(BaseModel):
    email: str
    first_name: str
    last_name: str

class UserDB(UserBase):
    role: UserRole = UserRole.user
    flag: Optional[str]

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
