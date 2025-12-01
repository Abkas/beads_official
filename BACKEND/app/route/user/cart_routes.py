from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.user.cart_schemas import CartItemResponse, CartItemRemove, CartItemAdd, CartItemUpdate, CartResponse
from app.services.user.cart_service import clear_cart , get_cart , add_to_cart , update_cart ,remove_from_cart
from app.core.security import get_current_user  # For authentication

router = APIRouter(
    prefix ='/users/me',
    tags= ['Users-cart']
)

@router.get("/cart", response_model=CartResponse)
def get_user_cart(current_user: dict = Depends(get_current_user)):
    result =  get_cart(current_user['user_id'])
    return result 

@router.post("/cart", response_model=CartResponse, status_code=status.HTTP_201_CREATED)
def add_item_to_cart(
    cart_item: CartItemAdd,
    current_user: dict = Depends(get_current_user),
):
    result =  add_to_cart(current_user['user_id'], cart_item)
    return result

@router.put("/cart", response_model=CartResponse)
def update_cart_item(
    cart_update: CartItemUpdate,
    current_user: dict = Depends(get_current_user)
):
    result =  update_cart(current_user['user_id'], cart_update)
    return result

@router.delete("/cart/{product_id}")
def remove_from_cart_route(
    product_id: str,
    current_user: dict = Depends(get_current_user)
):
    result = remove_from_cart(current_user['user_id'], product_id)
    return result

@router.delete("/cart")
def clear_cart_route(
    current_user: dict = Depends(get_current_user)
):
    clear_cart(current_user['user_id'])
    return None