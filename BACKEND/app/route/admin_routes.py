from fastapi import APIRouter, Depends, HTTPException
from app.core.security import get_current_user
from app.services.admin_service import get_all_users, get_user_by_id_admin

router = APIRouter(
    prefix='/admin',
    tags=['Admin']
)

# Get all users (admin only)
@router.get('/customers')
def get_all_customers(current_user: dict = Depends(get_current_user)):
    if not current_user.get('is_admin'):
        raise HTTPException(status_code=403, detail="Not authorized")
    return get_all_users()

# Get specific user by ID (admin only)
@router.get('/customers/{user_id}')
def get_customer(user_id: str, current_user: dict = Depends(get_current_user)):
    if not current_user.get('is_admin'):
        raise HTTPException(status_code=403, detail="Not authorized")
    user = get_user_by_id_admin(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
