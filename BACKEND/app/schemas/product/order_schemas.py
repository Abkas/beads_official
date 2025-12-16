from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from typing import Literal

class OrderItemSchema(BaseModel):
    product_id: str 
    product_name: str 
    quantity: int = Field(ge=1)
    price: float = Field(ge=0)
    product_image: Optional[str] = Field(default=None, description="Product image URL")
class OrderCreate(BaseModel):
    address_index: int = Field(ge=0, description="Which saved address to use (0 = first address)")
    payment_method: str = Field(description="Payment method: cod, esewa, khalti, bank_transfer")
    
    coupon_code: Optional[str] = Field(default=None, description="Coupon code if any")

class OrderResponse(BaseModel):
    id: str 
    user_id: str
    items: List[OrderItemSchema] = Field(description="List of products ordered")
    subtotal: float = Field(ge=0)
    shipping_cost: float = Field(ge=0)
    discount_amount: float = Field(ge=0, default=0.0, description="Discount applied from coupon")
    coupon_code: Optional[str] = Field(default=None, description="Coupon code if any")
    total: float = Field(ge=0)
    shipping_address: dict 
    payment_method: str = Field(description="Payment method: cod, esewa, khalti, bank_transfer")
    status: str = Field(description="Order status: pending, processing, shipped, delivered, cancelled")
    payment_status: str = Field(description="Payment status: unpaid, paid, failed, refunded")
    created_at: datetime = Field(description="When order was placed")
    

class OrderStatusUpdate(BaseModel):
    status: Literal["pending", "processing", "shipped", "delivered", "cancelled"] = Field(
        description="New order status"
    )
class OrderPaymentUpdate(BaseModel):
    payment_status: Literal["unpaid", "paid", "failed", "refunded"] = Field(
        description="New payment status"
    )
class OrderListItem(BaseModel):
    id: str
    user_id: str
    total: float
    
    status: str
    payment_status: str
    payment_method: str
    shipping_address: dict
    created_at: datetime
    item_count: int = Field(description="How many different products in order")
