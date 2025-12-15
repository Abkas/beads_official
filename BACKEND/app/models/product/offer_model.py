from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class Offer(BaseModel):
    id: Optional[str] = Field(default=None, alias='_id')
    name: str = Field(description="Offer name like 'Summer Sale', 'Black Friday'")
    slug: str = Field(description="URL-friendly version: summer-sale, black-friday")
    
    description: Optional[str] = Field(default=None, description="Offer description")
    
    # Discount settings
    discount_type: str = Field(default="percentage", description="'percentage' or 'fixed'")
    discount_value: float = Field(default=0, ge=0, description="Discount amount (10 for 10% or 100 for $100)")
    
    # Display settings
    color: str = Field(default="bg-primary", description="Tailwind color class for badge")
    icon: Optional[str] = Field(default=None, description="Icon name or emoji")
    
    # Bonus/Extra benefits
    bonus_text: Optional[str] = Field(default=None, description="Extra bonus like 'Free Shipping', 'Gift Wrap'")
    
    # Status and timing
    is_active: bool = Field(default=True, description="Whether offer is currently active")
    start_date: Optional[datetime] = Field(default=None, description="When offer starts")
    end_date: Optional[datetime] = Field(default=None, description="When offer ends")
    
    # Priority for display (higher = shown first)
    priority: int = Field(default=0, description="Display priority")
    
    created_at: datetime = Field(default_factory=datetime.now)
    
    class Config:
        populate_by_name = True
