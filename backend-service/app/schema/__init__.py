from enum import IntEnum
from pydantic import BaseModel

class UserRole(IntEnum):
    admin = 0
    user = 1

class UserBase(BaseModel):
    email: str
    first_name: str
    last_name: str
    role: UserRole = UserRole.user

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
