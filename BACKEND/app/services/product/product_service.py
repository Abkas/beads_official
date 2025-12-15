from app.core.database import client
from bson.objectid import ObjectId
from datetime import datetime
from app.services.product.category_service import collection as category_collection

db = client['beads_db']
offers_collection = db['offers']

def calculate_best_discount(original_price, offers_list, manual_discount_amount=None):
    """
    Calculate the best discount from manual discount and active offers
    Returns: (final_price, best_discount_amount, applied_offer_name)
    """
    if not original_price or original_price <= 0:
        return original_price, None, None
    
    best_price = original_price
    best_discount_amount = None
    best_offer_name = None
    
    # Check manual discount first
    if manual_discount_amount and manual_discount_amount > 0:
        manual_price = original_price - manual_discount_amount
        if manual_price < best_price:
            best_price = manual_price
            best_discount_amount = manual_discount_amount
    
    # Check all offers
    if offers_list:
        # Fetch active offers from database
        active_offers = list(offers_collection.find({
            'name': {'$in': offers_list},
            'is_active': True
        }).sort('priority', -1))
        
        for offer in active_offers:
            discount_type = offer.get('discount_type', 'percentage')
            discount_value = offer.get('discount_value', 0)
            
            if discount_type == 'percentage':
                offer_discount = original_price * (discount_value / 100)
                offer_price = original_price - offer_discount
            else:  # fixed
                offer_discount = discount_value
                offer_price = original_price - offer_discount
            
            # Keep best (lowest price)
            if offer_price < best_price:
                best_price = offer_price
                best_discount_amount = offer_discount
                best_offer_name = offer.get('name')
    
    # Ensure price doesn't go negative
    best_price = max(0, best_price)
    
    return round(best_price, 2), best_discount_amount, best_offer_name

def get_all_products(category=None, search=None, min_price=None, max_price=None, is_available=True, skip=0, limit=50):
    query = {}
    if category:
        query["category"] = category
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}}
        ]
    if min_price is not None or max_price is not None:
        price_query = {}
        if min_price is not None:
            price_query["$gte"] = min_price
        if max_price is not None:
            price_query["$lte"] = max_price
        query["price"] = price_query
    if is_available is not None:
        query["is_available"] = is_available
    products = list(db["products"].find(query).skip(skip).limit(limit))
    product_list = []
    for product in products:
        # Calculate dynamic pricing with offers
        original_price = product.get("original_price", product.get("price", 0.0))
        manual_discount = product.get("discount_price")
        offers = product.get("offers", [])
        
        # Calculate best price considering manual discount and offers
        final_price, applied_discount, applied_offer = calculate_best_discount(
            original_price, offers, manual_discount
        )
        
        product_response = {
            "id": str(product.get("_id")),
            "name": product.get("name", ""),
            "description": product.get("description", ""),
            "image_urls": product.get("image_urls", []),
            "original_price": original_price,
            "price": final_price,
            "discount_price": product.get("discount_price", None),
            "applied_discount": applied_discount,
            "applied_offer": applied_offer,
            "currency": product.get("currency", "NPR"),
            "stock_quantity": product.get("stock_quantity", 0),
            "is_available": product.get("is_available", True),
            "category": product.get("category", ""),
            "subcategory": product.get("subcategory", None),
            "tags": product.get("tags", []),
            "offers": offers,
            "ratings": product.get("ratings", 0.0),
            "review_count": product.get("review_count", 0),
            "created_at": product.get("created_at", None),
            "is_active": product.get("is_active", True)
        }
        product_list.append(product_response)
    return product_list

def get_product_by_id(product_id):
    product = db["products"].find_one({"_id": ObjectId(product_id)})
    if product:
        # Calculate dynamic pricing with offers
        original_price = product.get("original_price", product.get("price", 0.0))
        manual_discount = product.get("discount_price")
        offers = product.get("offers", [])
        
        # Calculate best price considering manual discount and offers
        final_price, applied_discount, applied_offer = calculate_best_discount(
            original_price, offers, manual_discount
        )
        
        product_response = {
            "id": str(product.get("_id")),
            "name": product.get("name", ""),
            "description": product.get("description", ""),
            "image_urls": product.get("image_urls", []),
            "original_price": original_price,
            "price": final_price,
            "discount_price": product.get("discount_price", None),
            "applied_discount": applied_discount,
            "applied_offer": applied_offer,
            "currency": product.get("currency", "NPR"),
            "stock_quantity": product.get("stock_quantity", 0),
            "is_available": product.get("is_available", True),
            "category": product.get("category", ""),
            "subcategory": product.get("subcategory", None),
            "tags": product.get("tags", []),
            "offers": offers,
            "ratings": product.get("ratings", 0.0),
            "review_count": product.get("review_count", 0),
            "created_at": product.get("created_at", None),
            "is_active": product.get("is_active", True)
        }
        return product_response
    return None

def create_product(product_data):
    product_dict = product_data.dict()
    product_dict["created_at"] = product_dict.get("created_at") or datetime.utcnow()
    product_dict["is_active"] = product_dict.get("is_active", True)
    product_dict["ratings"] = product_dict.get("ratings", 0.0)
    product_dict["review_count"] = product_dict.get("review_count", 0)
    
    # Set original_price from price field (this is the fixed base price)
    original_price = product_dict.get("price", 0.0)
    product_dict["original_price"] = original_price
    
    # Calculate final price: original_price - discount_price
    discount_price = product_dict.get("discount_price")
    if discount_price is not None and discount_price > 0 and discount_price < original_price:
        # Apply discount: final price = original - discount amount
        product_dict["price"] = original_price - discount_price
    else:
        # No discount or invalid discount
        product_dict["price"] = original_price
        product_dict["discount_price"] = None

    # Validate category name exists
    category_doc = category_collection.find_one({"name": product_dict["category"]})
    if not category_doc:
        raise ValueError("Category does not exist.")
    result = db["products"].insert_one(product_dict)
    return get_product_by_id(str(result.inserted_id))

def update_product(product_id, product_update):
    result = db["products"].update_one(
        {"_id": ObjectId(product_id)},
        {"$set": product_update.dict(exclude_unset=True)}
    )
    # Return product even if nothing was modified (matched_count > 0 means product exists)
    if result.matched_count:
        return get_product_by_id(product_id)
    return None

def update_product_price(product_id, price_update):
    # Get current product to access original_price
    product = db["products"].find_one({"_id": ObjectId(product_id)})
    if not product:
        return None
    
    update_data = {}
    
    # Get the original price (never changes unless explicitly updated)
    original_price = product.get("original_price", product.get("price", 0.0))
    
    # Only update original_price if explicitly provided AND it's different
    if price_update.price is not None and price_update.price != original_price:
        update_data["original_price"] = price_update.price
        original_price = price_update.price
        # When original price changes, recalculate based on current discount
        current_discount = product.get("discount_price")
        if current_discount and current_discount > 0 and current_discount < original_price:
            update_data["price"] = original_price - current_discount
            update_data["discount_price"] = current_discount
        else:
            update_data["price"] = original_price
            update_data["discount_price"] = None
    
    if price_update.currency:
        update_data["currency"] = price_update.currency
    
    # Handle discount_price update: calculate final price = original - discount
    if price_update.discount_price is not None:
        if price_update.discount_price > 0 and price_update.discount_price < original_price:
            update_data["discount_price"] = price_update.discount_price
            update_data["price"] = original_price - price_update.discount_price
        else:
            # Remove discount
            update_data["discount_price"] = None
            update_data["price"] = original_price
    
    result = db["products"].update_one(
        {"_id": ObjectId(product_id)},
        {"$set": update_data}
    )
    if result.matched_count:
        return get_product_by_id(product_id)
    return None

def update_product_stock(product_id, stock_update):
    result = db["products"].update_one(
        {"_id": ObjectId(product_id)},
        {"$set": {"stock_quantity": stock_update.stock_quantity}}
    )
    if result.matched_count:
        return get_product_by_id(product_id)
    return None

def change_availability(product_id, is_available):
    result = db["products"].update_one(
        {"_id": ObjectId(product_id)},
        {"$set": {"is_available": is_available}}
    )
    if result.matched_count:
        return get_product_by_id(product_id)
    return None

def delete_product(product_id):
    result = db["products"].delete_one({"_id": ObjectId(product_id)})
    return result.deleted_count > 0



db = client['beads_db']  # Use your DB name here



