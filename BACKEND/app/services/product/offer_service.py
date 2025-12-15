from app.core.database import client
from app.models.product.offer_model import Offer
from app.schemas.product.offer_schemas import OfferCreate, OfferUpdate
from bson import ObjectId
from datetime import datetime

db = client['beads_db']
collection = db['offers']
products_collection = db['products']

def get_all_offers():
    """Get all offers with product counts"""
    offers = list(collection.find().sort('priority', -1))  # Sort by priority descending
    result = []
    for offer in offers:
        offer['_id'] = str(offer['_id'])
        if 'created_at' not in offer:
            offer['created_at'] = datetime.min
        
        # Count products with this offer
        product_count = products_collection.count_documents({'offers': offer['name']})
        offer['product_count'] = product_count
        
        result.append(Offer(**offer))
    return result

def get_active_offers():
    """Get only active offers"""
    now = datetime.utcnow()
    query = {'is_active': True}
    
    # Optional: Check date ranges if needed
    # Can add: $or: [{'start_date': None}, {'start_date': {'$lte': now}}]
    
    offers = list(collection.find(query).sort('priority', -1))
    result = []
    for offer in offers:
        offer['_id'] = str(offer['_id'])
        if 'created_at' not in offer:
            offer['created_at'] = datetime.min
        result.append(Offer(**offer))
    return result

def get_offer_by_id(offer_id: str):
    """Get single offer by ID"""
    offer = collection.find_one({'_id': ObjectId(offer_id)})
    if offer:
        offer['_id'] = str(offer['_id'])
        if 'created_at' not in offer:
            offer['created_at'] = datetime.min
        return Offer(**offer)
    return None

def create_offer(offer: OfferCreate):
    """Create new offer"""
    data = offer.dict()
    data['created_at'] = datetime.utcnow()
    result = collection.insert_one(data)
    return Offer(**{**data, '_id': str(result.inserted_id)})

def update_offer(offer_id: str, offer: OfferUpdate):
    """Update offer and sync with products"""
    update_data = {k: v for k, v in offer.dict().items() if v is not None}
    
    # Get old offer before updating
    old_offer = collection.find_one({'_id': ObjectId(offer_id)})
    if not old_offer:
        return None
    
    old_name = old_offer.get('name')
    new_name = update_data.get('name')
    
    # Update the offer
    collection.update_one({'_id': ObjectId(offer_id)}, {'$set': update_data})
    
    # If offer name changed, update all products with this offer
    if new_name and old_name != new_name:
        # Update products: replace old offer name with new name in the offers array
        products_collection.update_many(
            {'offers': old_name},
            {'$set': {'offers.$[elem]': new_name}},
            array_filters=[{'elem': old_name}]
        )
    
    updated = collection.find_one({'_id': ObjectId(offer_id)})
    if updated:
        updated['_id'] = str(updated['_id'])
        return Offer(**updated)
    return None

def toggle_offer_active(offer_id: str):
    """Toggle offer active status"""
    offer = collection.find_one({'_id': ObjectId(offer_id)})
    if not offer:
        return None
    
    new_status = not offer.get('is_active', True)
    collection.update_one({'_id': ObjectId(offer_id)}, {'$set': {'is_active': new_status}})
    
    updated = collection.find_one({'_id': ObjectId(offer_id)})
    if updated:
        updated['_id'] = str(updated['_id'])
        return Offer(**updated)
    return None

def delete_offer(offer_id: str):
    """Delete offer (only if no products use it)"""
    # Get offer name before deleting
    offer = collection.find_one({'_id': ObjectId(offer_id)})
    if not offer:
        return False
    
    # Check if offer has products
    product_count = products_collection.count_documents({'offers': offer.get('name')})
    if product_count > 0:
        raise ValueError(f"Cannot delete offer. It's applied to {product_count} products.")
    
    result = collection.delete_one({'_id': ObjectId(offer_id)})
    return result.deleted_count > 0

def get_offer_products(offer_id: str):
    """Get all products with this offer"""
    offer = collection.find_one({'_id': ObjectId(offer_id)})
    if not offer:
        return None
    
    offer_name = offer.get('name')
    products = list(products_collection.find({'offers': offer_name}))
    
    # Format products
    for product in products:
        product['_id'] = str(product['_id'])
    
    return {
        'offer': {
            'id': str(offer['_id']),
            'name': offer_name,
            'slug': offer.get('slug', ''),
            'discount_type': offer.get('discount_type', 'percentage'),
            'discount_value': offer.get('discount_value', 0),
        },
        'products': products,
        'total': len(products)
    }
