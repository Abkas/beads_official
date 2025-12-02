from pydantic import BaseModel, Field, EmailStr
from typing import Optional , List
from datetime import datetime

class UserCreate(BaseModel):
    username:str
    email:EmailStr
    password:str
    firstname :str
    lastname:str
    phone:Optional[str]
class UserLogin(BaseModel):
    email:EmailStr
    password:str

class UserResponse(BaseModel):
    id: Optional[str]
    username: str
    email: EmailStr
    firstname: str
    lastname: str

    phone: Optional[str] = None
    profile_image: Optional[str] = None
    addresses: Optional[list] = None

    Cart: Optional[list] = None

    order_history: Optional[list] = None
    wishlist: Optional[list] = None

    is_verified: bool = False
    is_active: bool = True
    is_admin: bool = False
    
    created_at: datetime
    last_login: Optional[datetime] = None

class UserUpdate(BaseModel):
    username: Optional[str]
    firstname: Optional[str]
    lastname: Optional[str]
    phone: Optional[str]
    profile_image: Optional[str]

class UserPassowrdChange(BaseModel):
    old_password: str = Field(min_length = 5)
    new_password: str = Field(min_length = 5)
    confirm_password: str = Field(min_length = 5)

class UserPasswordResetRequest(BaseModel):
    email: EmailStr = Field(descripton = 'Email to send reset pw link to')