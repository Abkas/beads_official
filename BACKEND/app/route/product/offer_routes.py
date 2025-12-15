from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.product.offer_schemas import OfferCreate, OfferUpdate, OfferResponse, OfferListItem
from app.services.product.offer_service import (
    get_all_offers, get_active_offers, get_offer_by_id, 
    create_offer, update_offer, toggle_offer_active, 
    delete_offer, get_offer_products
)
from app.core.security import get_admin_user

router = APIRouter(
    prefix='/offers',
    tags=['Offers']
)

# Public Routes

@router.get('/', response_model=list[OfferListItem])
def get_all_offers_route():
    """Get all offers (admin view with product counts)"""
    result = get_all_offers()
    return [offer.dict(by_alias=True) for offer in result]

@router.get('/active', response_model=list[OfferResponse])
def get_active_offers_route():
    """Get only active offers (public)"""
    result = get_active_offers()
    return [offer.dict(by_alias=True) for offer in result]

@router.get('/{offer_id}', response_model=OfferResponse)
def get_offer_by_id_route(offer_id: str):
    """Get single offer by ID"""
    result = get_offer_by_id(offer_id)
    if result:
        return result.dict(by_alias=True)
    raise HTTPException(status_code=404, detail="Offer not found")

@router.get('/{offer_id}/products')
def get_offer_products_route(offer_id: str):
    """Get all products with this offer"""
    result = get_offer_products(offer_id)
    if not result:
        raise HTTPException(status_code=404, detail="Offer not found")
    return result

# Admin Routes

@router.post('/', response_model=OfferResponse)
def create_offer_route(
    offer: OfferCreate,
    admin_user: dict = Depends(get_admin_user)
):
    """Create new offer (admin only)"""
    result = create_offer(offer)
    return result.dict(by_alias=True)

@router.put('/{offer_id}', response_model=OfferResponse)
def update_offer_route(
    offer_id: str,
    offer_update: OfferUpdate,
    admin_user: dict = Depends(get_admin_user)
):
    """Update offer (admin only)"""
    result = update_offer(offer_id, offer_update)
    if not result:
        raise HTTPException(status_code=404, detail="Offer not found")
    return result.dict(by_alias=True)

@router.patch('/{offer_id}/toggle-active', response_model=OfferResponse)
def toggle_offer_active_route(
    offer_id: str,
    admin_user: dict = Depends(get_admin_user)
):
    """Toggle offer active status (admin only)"""
    result = toggle_offer_active(offer_id)
    if not result:
        raise HTTPException(status_code=404, detail="Offer not found")
    return result.dict(by_alias=True)

@router.delete('/{offer_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_offer_route(
    offer_id: str,
    admin_user: dict = Depends(get_admin_user)
):
    """Delete offer (admin only)"""
    try:
        delete_offer(offer_id)
        return None
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
