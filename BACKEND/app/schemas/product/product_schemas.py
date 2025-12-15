from pydantic import BaseModel , Field
from typing import Optional , List
from datetime import datetime

class CreateProduct(BaseModel):
    name : str
    description : str

    price: float
    discount_price : Optional[float]
    currency: Optional[str] = Field(default="NPR")

    stock_quantity : Optional[int]
    category: Optional[str]
    subcategory : Optional[str]
    tags : List[str] = Field(default=[]) 
    offers: List[str] = Field(default=[])

    image_urls: List[str] = Field(default=[]) 
    is_available : Optional[bool]

class ProductDetailUpdate(BaseModel):
    name: Optional[str]
    description: Optional[str]
    category: Optional[str]
    tags: Optional[List[str]] = None
    offers: Optional[List[str]] = None
    image_urls: Optional[List[str]] = None
    is_active: Optional[bool] = None 

class ProductPriceUpdate(BaseModel):
    price: Optional[float]
    currency: Optional[str] = None
    discount_price: Optional[float]

class ProductStockUpdate(BaseModel):
    stock_quantity: int = Field(ge=0)

class ChangeAvailabilityProduct(BaseModel):
    is_available : Optional[bool]
    
class ProductResponse(BaseModel):
    id : str
    name : str
    description: str
    image_urls : List[str]

    original_price: float
    price : float
    discount_price: Optional[float]
    applied_discount: Optional[float] = None
    applied_offer: Optional[str] = None
    currency: str

    stock_quantity : int
    is_available : bool

    category : str
    subcategory : Optional[str]
    tags: List[str]
    offers: List[str]

    ratings : float
    review_count : int

    created_at : datetime
    is_active : bool

