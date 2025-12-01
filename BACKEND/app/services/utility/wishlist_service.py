from app.core.database import client
from bson.objectid import ObjectId
from bson.errors import InvalidId
from datetime import datetime
from app.services.user.cart_service import add_to_cart
from app.schemas.user.cart_schemas import CartItemAdd
from fastapi import HTTPException
from bson.errors import InvalidId


def get_wishlist(user_id):
    wishlist = db["wishlists"].find_one({"user_id": user_id})
    items = wishlist["items"] if wishlist and "items" in wishlist else []
    response_items = []
    for item in items:
        product = None
        try:
            product = db["products"].find_one({"_id": ObjectId(item["product_id"])})
        except (InvalidId, TypeError):
            product = db["products"].find_one({"_id": item["product_id"]})
        if not product:
            # Try matching by string if ObjectId fails
            product = db["products"].find_one({"_id": str(item["product_id"])})
        response_items.append({
            "product_id": item["product_id"],
            "product_name": product["name"] if product else "(Product not found)",
            "product_price": float(product["price"]) if product and product.get("price") is not None else 0.0,
            "product_image": product["images"][0] if product and product.get("images") else None,
            "is_available": product["is_available"] if product else False,
            "added_at": item["added_at"],
            "notify_on_sale": item.get("notify_on_sale", False),
            "notify_on_restock": item.get("notify_on_restock", False),
            "priority": item.get("priority", "normal"),
            "notes": item.get("notes")
        })
    return {
        "items": response_items,
        "total_items": len(response_items)
    }

def add_item(user_id, wishlist_item):
	wishlist = db["wishlists"].find_one({"user_id": user_id})
	item = wishlist_item.dict()
	item["added_at"] = datetime.utcnow()
	if wishlist:
		for existing in wishlist["items"]:
			if existing["product_id"] == item["product_id"]:
				raise Exception("Product already in wishlist")
		db["wishlists"].update_one({"user_id": user_id}, {"$push": {"items": item}})
	else:
		db["wishlists"].insert_one({"user_id": user_id, "items": [item]})
	return get_wishlist(user_id)

def update_item(user_id, product_id, wishlist_update):
    wishlist = db["wishlists"].find_one({"user_id": user_id})
    if not wishlist:
        raise HTTPException(status_code=404, detail="Wishlist not found")
    updated = False
    for idx, item in enumerate(wishlist["items"]):
        if str(item["product_id"]) == str(product_id):
            for key, value in wishlist_update.dict(exclude_unset=True).items():
                if key == "product_id":
                    continue  #
                if value is not None:
                    wishlist["items"][idx][key] = value
            updated = True
    if updated:
        db["wishlists"].update_one({"user_id": user_id}, {"$set": {"items": wishlist["items"]}})
    else:
        raise HTTPException(status_code=404, detail="Product not found in wishlist")
    return get_wishlist(user_id)

def delete_item(user_id, product_id):
	db["wishlists"].update_one({"user_id": user_id}, {"$pull": {"items": {"product_id": product_id}}})
	return

def move_to_cart(user_id, product_id, move_data):
    db["wishlists"].update_one({"user_id": user_id}, {"$pull": {"items": {"product_id": product_id}}})

    quantity = getattr(move_data, "quantity", 1)  # Default quantity is 1
    cart_item = CartItemAdd(product_id=product_id, quantity=quantity)
    add_to_cart(user_id, cart_item)

    return get_wishlist(user_id)

db = client['beads_db']  # Use your DB name here

