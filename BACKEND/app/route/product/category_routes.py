from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.product.category_schemas import CategoryCreate, CategoryUpdate, CategoryResponse, CategoryListItem, CategoryToggleActive
from app.services.product.category_service import get_all_categories, get_category_by_id , create_category, update_category, toggle_category_active,delete_category
from app.core.security import get_admin_user
from fastapi import Body
from app.schemas.product.category_schemas import CategoryToggleActive


router = APIRouter(
    prefix='/categories',
    tags=['Categories']
)


# Public Routes

@router.get('/', response_model=list[CategoryListItem])
def get_all_categories_route():
    result = get_all_categories()
    return [cat.dict(by_alias=True) for cat in result]


@router.get('/{category_id}', response_model=CategoryResponse)
def get_category_by_id_route(category_id: str):
    result = get_category_by_id(category_id)
    if result:
        return result.dict(by_alias=True)
    return None


# Admin Routes

@router.post('/', response_model=CategoryResponse)
def create_category_route(
    category: CategoryCreate,
    admin_user: dict = Depends(get_admin_user)
):
    result = create_category(category)
    return result


@router.put('/{category_id}', response_model=CategoryResponse)
def update_category_route(
    category_id: str,
    category_update: CategoryUpdate,
    admin_user: dict = Depends(get_admin_user)
):
    result =  update_category(category_id, category_update)
    return result


@router.patch('/{category_id}/toggle-active', response_model=CategoryResponse)

def toggle_category_active_route(
    category_id: str,
    admin_user: dict = Depends(get_admin_user)
):
    result = toggle_category_active(category_id)
    return result


@router.delete('/{category_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_category_route (
    category_id: str,
    admin_user: dict = Depends(get_admin_user)
):
    delete_category(category_id)
    return None
