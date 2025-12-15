from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class OfferCreate(BaseModel):
    name: str = Field(description="Offer name")
    slug: str = Field(description="URL-friendly slug")
    description: Optional[str] = None
    discount_type: str = Field(default="percentage", description="'percentage' or 'fixed'")
    discount_value: float = Field(default=0, ge=0)
    color: str = Field(default="bg-primary")
    icon: Optional[str] = None
    bonus_text: Optional[str] = None
    is_active: bool = True
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    priority: int = Field(default=0)
    
    class Config:
        json_schema_extra = {
            "example": {
                "name": "Summer Sale",
                "slug": "summer-sale",
                "description": "Hot summer deals",
                "discount_type": "percentage",
                "discount_value": 15,
                "color": "bg-destructive",
                "icon": "🔥",
                "bonus_text": "Free Shipping",
                "is_active": True,
                "priority": 10
            }
        }

class OfferUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    discount_type: Optional[str] = None
    discount_value: Optional[float] = None
    color: Optional[str] = None
    icon: Optional[str] = None
    bonus_text: Optional[str] = None
    is_active: Optional[bool] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    priority: Optional[int] = None

class OfferResponse(BaseModel):
    id: str = Field(alias="_id")
    name: str
    slug: str
    description: Optional[str] = None
    discount_type: str
    discount_value: float
    color: str
    icon: Optional[str] = None
    bonus_text: Optional[str] = None
    is_active: bool
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    priority: int
    created_at: datetime
    
    class Config:
        populate_by_name = True

class OfferListItem(BaseModel):
    id: str = Field(alias="_id")
    name: str
    slug: str
    discount_type: str
    discount_value: float
    color: str
    icon: Optional[str] = None
    is_active: bool
    product_count: Optional[int] = 0
    
    class Config:
        populate_by_name = True
