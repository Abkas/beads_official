from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.utility.coupon_schemas import CouponCreate, CouponListItem, CouponResponse, CouponUpdate, CouponValidate, CouponValidateResponse
from app.services.utility.coupon_service import create_coupon,get_coupon_by_id,apply_coupon_to_cart,delete_coupon,toggle_coupon_activity,update_coupon,get_all_coupons,validate_coupon,get_active_coupons
from app.core.security import get_current_user, get_admin_user

router = APIRouter(
    prefix='/coupons',
    tags=['Coupons']
)


# Admin Routes - Coupon Management

@router.post('/', response_model=CouponResponse)
def create_coupon_route(
    coupon: CouponCreate,
    admin_user: dict = Depends(get_admin_user)
):
    if not admin_user or not admin_user.get('is_admin', False):
        raise HTTPException(status_code=403, detail="Admin access required")
    result = create_coupon(coupon)
    return CouponResponse(**result)


@router.get('/', response_model=list[CouponListItem])
def get_all_coupons_route(admin_user: dict = Depends(get_admin_user)):
    result = get_all_coupons()
    return [CouponListItem(**item) for item in result]


@router.get('/{coupon_id}', response_model=CouponResponse)
def get_coupon_by_id_route(
    coupon_id: str,
    admin_user: dict = Depends(get_admin_user)
):
    result = get_coupon_by_id(coupon_id)
    return CouponResponse(**result)


@router.put('/{coupon_id}', response_model=CouponResponse)
def update_coupon_route(
    coupon_id: str,
    coupon_update: CouponUpdate,
    admin_user: dict = Depends(get_admin_user)
):
    result = update_coupon(coupon_id, coupon_update)
    return CouponResponse(**result)


@router.delete('/{coupon_id}')
def delete_coupon_route(
    coupon_id: str,
    admin_user: dict = Depends(get_admin_user)
):
    delete_coupon(coupon_id)
    return None


@router.patch('/{coupon_id}/toggle', response_model=CouponResponse)
def toggle_coupon_activity_route(
    coupon_id: str,
    admin_user: dict = Depends(get_admin_user)
):
    result = toggle_coupon_activity(coupon_id)
    if not result:
        raise HTTPException(status_code=404, detail="Coupon not found or not updated")
    return CouponResponse(**result)


# User Routes - Apply Coupons

@router.post('/validate', response_model=CouponValidateResponse)
def validate_coupon_route(
    validation_data: CouponValidate,
    current_user: dict = Depends(get_current_user)
):
    result = validate_coupon(
        validation_data.coupon_code,
        validation_data.cart_total,
        current_user['user_id']
    )
    return CouponValidateResponse(**result)


@router.get('/active', response_model=list[CouponListItem])
def get_active_coupons_route(admin_user: dict = Depends(get_admin_user)):
    result = get_active_coupons()
    return [CouponListItem(**item) for item in result]