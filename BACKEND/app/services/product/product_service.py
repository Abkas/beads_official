from app.core.database import client
from bson.objectid import ObjectId
from datetime import datetime
from app.services.product.category_service import collection as category_collection

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
        product_response = {
            "id": str(product.get("_id")),
            "name": product.get("name", ""),
            "description": product.get("description", ""),
            "image_urls": product.get("image_urls", []),
            "price": product.get("price", 0.0),
            "discount_price": product.get("discount_price", 0.0),
            "currency": product.get("currency", "NPR"),
            "stock_quantity": product.get("stock_quantity", 0),
            "is_available": product.get("is_available", True),
            "category": product.get("category", ""),
            "subcategory": product.get("subcategory", None),
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
        product_response = {
            "id": str(product.get("_id")),
            "name": product.get("name", ""),
            "description": product.get("description", ""),
            "image_urls": product.get("image_urls", []),
            "price": product.get("price", 0.0),
            "discount_price": product.get("discount_price", 0.0),
            "currency": product.get("currency", "NPR"),
            "stock_quantity": product.get("stock_quantity", 0),
            "is_available": product.get("is_available", True),
            "category": product.get("category", ""),
            "subcategory": product.get("subcategory", None),
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
    if result.modified_count:
        return get_product_by_id(product_id)
    return None

def update_product_price(product_id, price_update):
    result = db["products"].update_one(
        {"_id": ObjectId(product_id)},
        {"$set": {"price": price_update.price}}
    )
    if result.modified_count:
        return get_product_by_id(product_id)
    return None

def update_product_stock(product_id, stock_update):
    result = db["products"].update_one(
        {"_id": ObjectId(product_id)},
        {"$set": {"stock_quantity": stock_update.stock_quantity}}
    )
    if result.modified_count:
        return get_product_by_id(product_id)
    return None

def change_availability(product_id, is_available):
    result = db["products"].update_one(
        {"_id": ObjectId(product_id)},
        {"$set": {"is_available": is_available}}
    )
    if result.modified_count:
        return get_product_by_id(product_id)
    return None

def delete_product(product_id):
    result = db["products"].delete_one({"_id": ObjectId(product_id)})
    return result.deleted_count > 0



db = client['beads_db']  # Use your DB name here



