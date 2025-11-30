from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.user.user_schema import UserCreate, UserLogin, UserResponse, UserUpdate
from app.services.user.user_service import register,login,get_user_by_id,update_user, delete_user
from app.core.security import get_current_user  # For authenticatio
from datetime import datetime

router = APIRouter(
    prefix ='/users',
    tags= ['Users']
)

@router.post("/register")
def register_user(user_credentials: UserCreate):
    result = register(user_credentials)
    return result

@router.post("/login")
def login_user(user_credentials: UserLogin):
    result = login(user_credentials)
    return result

@router.post('/logout')
def logout_user(current_user: dict = Depends(get_current_user)):
    return {"message": "Logged out successfully"}

# Profile Management Routes

@router.get('/me', response_model=UserResponse)

def get_current_user_profile(current_user: dict = Depends(get_current_user)):
    user = get_user_by_id(current_user['user_id'])
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserResponse(
        id=str(user.get("_id", "")),
        username=user.get("username", ""),
        email=user.get("email", ""),
        firstname=user.get("firstname", ""),
        lastname=user.get("lastname", ""),
        phone=user.get("phone"),
        profile_image=user.get("profile_image"),
        addresses=user.get("addresses", []),
        Cart=user.get("Cart", []),
        order_history=user.get("order_history", []),
        wishlist=user.get("wishlist", []),
        is_verified=bool(user.get("is_verified", False)),
        is_active=bool(user.get("is_active", True)),
        is_admin=bool(user.get("is_admin", False)),
        created_at=user.get("created_at") or datetime.utcnow(),
        last_login=user.get("last_login")
    )


@router.put('/me', response_model=UserResponse)
def update_user_profile(
    user_update: UserUpdate,
    current_user: dict = Depends(get_current_user)
):
    result = update_user(current_user['user_id'], user_update)
    return result


@router.delete('/me', status_code=status.HTTP_204_NO_CONTENT)
def delete_user_account(current_user: dict = Depends(get_current_user)):
    delete_user(current_user['user_id'])
    return None