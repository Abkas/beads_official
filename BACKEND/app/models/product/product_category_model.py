from pydantic import BaseModel , Field
from typing import List, Optional
from datetime import datetime

class Category(BaseModel):
    id: Optional[str] = Field(default= None, alias= '_id')
    name: str = Field(description = "Category name like Electronics,Clothing")
    slug: str = Field(description="electronics, clothing (URL-friendly)")
    
    description :Optional[str]= Field(default = None)

    parent_category: Optional[str] = Field(default = None, descriptoin ="For Subcategories")

    image_url: Optional[str] = Field(default = None)
    is_active: bool = Field(default=True, description="Whether the category is active")
    
    product_count: Optional[int] = Field(default=0, description="Number of products in this category")

    created_at : datetime = Field(Default_factory = datetime.now)