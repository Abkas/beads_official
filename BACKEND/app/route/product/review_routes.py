from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.product.review_schemas import ReviewCreate, ReviewUpdate, ReviewResponse, ReviewListItem, ReviewApprovalUpdate, ReviewHelpfulUpdate
from app.services.product.review_service import get_review_by_id, mark_review_helpful, create_review, delete_review, update_review, update_review_approval, get_product_reviews
from app.core.security import get_current_user, get_admin_user


router = APIRouter(
    prefix='/reviews',
    tags=['Reviews']
)
# User Routes

@router.post('/products/{product_id}', response_model=ReviewResponse)
def create_review_route(
    product_id: str,
    review: ReviewCreate,
    current_user: dict = Depends(get_current_user)
):
    result = create_review(product_id, current_user['user_id'], review)
    return result


@router.get('/products/{product_id}', response_model=list[ReviewListItem])
def get_product_reviews_route(
    product_id: str,
    skip: int = 0,
    limit: int = 20
):
    result = get_product_reviews(product_id, skip, limit)
    return result


@router.put('/{review_id}', response_model=ReviewResponse)
def update_review_route(
    review_id: str,
    review_update: ReviewUpdate,
    current_user: dict = Depends(get_current_user)
):
    result = update_review(review_id, current_user['user_id'], review_update)
    return result


@router.delete('/{review_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_review_route(
    review_id: str,
    current_user: dict = Depends(get_current_user)
):
    delete_review(review_id, current_user['user_id'])
    return None


@router.post('/{review_id}/helpful', response_model=ReviewResponse)
def mark_review_helpful_route(
    review_id: str,
    helpful_data: ReviewHelpfulUpdate,
    current_user: dict = Depends(get_current_user)
):
    result = mark_review_helpful(review_id, current_user['user_id'], helpful_data.action)
    return result


# Admin Routes

@router.patch('/{review_id}/approval', response_model=ReviewResponse)
async def update_review_approval_route(
    review_id: str,
    approval: ReviewApprovalUpdate,
    admin_user: dict = Depends(get_admin_user)
):
    result = update_review_approval(review_id, approval.is_approved)
    return result
