from fastapi import APIRouter, Depends, HTTPException, status
from typing import Optional
from app.schemas.product.product_schemas import (CreateProduct, ProductDetailUpdate, ProductPriceUpdate, ProductStockUpdate, ChangeAvailabilityProduct, ProductResponse)
from app.services.product.product_service import (
    change_availability as change_availability_service,
    get_product_by_id as get_product_by_id_service,
    create_product as create_product_service,
    delete_product as delete_product_service,
    update_product as update_product_service,
    update_product_price as update_product_price_service,
    update_product_stock as update_product_stock_service,
    get_all_products as get_all_products_service
)
from app.core.security import get_admin_user

router = APIRouter(
    prefix='/products',
    tags=['Products']
)

# Public Routes - Product Browsing

@router.get('/', response_model=list[ProductResponse])
def get_all_products(
    category: Optional[str] = None,
    search: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    is_available: Optional[bool] = True,
    skip: int = 0,
    limit: int = 50
):
    result = get_all_products_service(
        category=category,
        search=search,
        min_price=min_price,
        max_price=max_price,
        is_available=is_available,
        skip=skip,
        limit=limit
    )
    return result


@router.get('/{product_id}', response_model=ProductResponse)
def get_product_by_id(product_id: str):
    result = get_product_by_id_service(product_id)
    return result


# Admin Routes - Product Management

@router.post('/', response_model=ProductResponse)
def create_product(
    product: CreateProduct,
    admin_user: dict = Depends(get_admin_user)
):
    result = create_product_service(product)
    return result


@router.put('/{product_id}/details', response_model=ProductResponse)
def update_product_details(
    product_id: str,
    product_update: ProductDetailUpdate,
    admin_user: dict = Depends(get_admin_user)
):
    result = update_product_service(product_id, product_update)
    return result


@router.put('/{product_id}/price', response_model=ProductResponse)
def update_product_price(
    product_id: str,
    price_update: ProductPriceUpdate,
    admin_user: dict = Depends(get_admin_user)
):
    result = update_product_price_service(product_id, price_update)
    return result


@router.put('/{product_id}/stock', response_model=ProductResponse)
def update_product_stock(
    product_id: str,
    stock_update: ProductStockUpdate,
    admin_user: dict = Depends(get_admin_user)
):
    result = update_product_stock_service(product_id, stock_update)
    return result


@router.patch('/{product_id}/availability', response_model=ProductResponse)
def toggle_product_availability(
    product_id: str,
    availability: ChangeAvailabilityProduct,
    admin_user: dict = Depends(get_admin_user)
):
    result = change_availability_service(product_id, availability.is_available)
    return result


@router.delete('/{product_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_product(
    product_id: str,
    admin_user: dict = Depends(get_admin_user)
):
    delete_product_service(product_id)
    return None
