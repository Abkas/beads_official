from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.utility.wishlist_schemas import WishlistItemAdd, WishlistItemRemove, WishlistItemResponse, WishlistItemUpdate, WishlistMoveToCart, WishlistResponse
from app.services.utility.wishlist_service import move_to_cart,add_item,update_item,delete_item,get_wishlist
from app.core.security import get_current_user  # For authentication

router = APIRouter(
    prefix ='/users/me',
    tags= ['Users-wishlist']
)

@router.get('/wishlist', response_model=WishlistResponse)
def get_user_wishlist(current_user: dict = Depends(get_current_user)):
    result = get_wishlist(current_user['user_id'])
    return result

@router.post('/wishlist', response_model=WishlistResponse)
def add_item_to_wishlist(
    wishlist_item: WishlistItemAdd,
    current_user: dict = Depends(get_current_user)
):
    result = add_item(current_user['user_id'], wishlist_item)
    return result

@router.put('/wishlist/{product_id}', response_model=WishlistResponse)
def update_wishlist_item(
    product_id: str,
    wishlist_update: WishlistItemUpdate,
    current_user: dict = Depends(get_current_user)
):
    result = update_item(current_user['user_id'], product_id, wishlist_update)
    return result

@router.delete('/wishlist/{product_id}')
def delete_item_from_wishlist(
    product_id: str,
    current_user: dict = Depends(get_current_user)
):
    delete_item(current_user['user_id'], product_id)
    return None

@router.post('/wishlist/move-to-cart')
def move_wishlist_to_cart(
    move_data: WishlistMoveToCart,
    current_user: dict = Depends(get_current_user)
):
    result = move_to_cart(current_user['user_id'], move_data.product_id, move_data)
    return result