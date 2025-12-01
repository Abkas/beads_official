from app.core.database import client
from bson.objectid import ObjectId
db = client['beads_db']  # Use your DB name here
def get_cart(user_id):
    cart = db['carts'].find_one({'user_id': user_id})
    if not cart:
        return {
            "items": [],
            "total_items": 0,
            "total_price": 0.0
        }
    cart_items = []
    total_items = 0
    total_price = 0.0
    for item in cart.get('items', []):
        # Fetch product details (name, price) from products collection
        product = db['products'].find_one({'_id': ObjectId(item['product_id'])})
        product_name = product['name'] if product else "Unknown"
        price = product['price'] if product else 0.0
        quantity = item.get('quantity', 1)
        subtotal = price * quantity
        cart_items.append({
            "product_id": item['product_id'],
            "product_name": product_name,
            "quantity": quantity,
            "price": price,
            "subtotal": subtotal
        })
        total_items += quantity
        total_price += subtotal
    return {
        "items": cart_items,
        "total_items": total_items,
        "total_price": total_price
    }

def add_to_cart(user_id , cart_item):
    product_id = cart_item.product_id
    quantity = cart_item.quantity
    if not validate_stock(product_id, quantity):
        raise Exception("Not enough stock")
    
    cart = db['carts'].find_one({'user_id' : user_id})
    if cart:
        for item in cart['items']:
            if item['product_id'] == product_id:
                item['quantity'] == quantity
                break
        else:
            cart['items'].append({'product_id': product_id, 'quantity': quantity})
        db["carts"].update_one({"_id": cart["_id"]}, {"$set": {"items": cart["items"]}})
    else:
        db['carts'].insert_one({
            'user_id': user_id,
            'items': [{'product_id': product_id, 'quantity': quantity}]
        })

    return get_cart(user_id)

def update_cart(user_id, cart_update):

    # Update a single item in the cart
    cart = db["carts"].find_one({"user_id": user_id})
    if not cart:
        return get_cart(user_id)
    updated = False
    for item in cart["items"]:
        if item["product_id"] == cart_update.product_id:
            item["quantity"] = cart_update.quantity
            updated = True
            break
    if not updated:
        cart["items"].append({"product_id": cart_update.product_id, "quantity": cart_update.quantity})
    db["carts"].update_one({"_id": cart["_id"]}, {"$set": {"items": cart["items"]}})
    return get_cart(user_id)

def remove_from_cart(user_id, product_id):
    cart = db["carts"].find_one({"user_id": user_id})
    if cart:
        new_items = []
        for item in cart["items"]:
            if item["product_id"] != product_id:
                new_items.append(item)
        db["carts"].update_one({"_id": cart["_id"]}, {"$set": {"items": new_items}})
    return get_cart(user_id)

def clear_cart(user_id):
    db["carts"].update_one({"user_id": user_id}, {"$set": {"items": []}})
    return get_cart(user_id)


def calculate_cart_total(cart):
    total = 0
    for item in cart["items"]:
        product = db["products"].find_one({"_id": ObjectId(item["product_id"])})
        if product:
            total += product["price"] * item["quantity"]
    return total

def validate_stock(product_id, quantity):
    product = db["products"].find_one({"_id": ObjectId(product_id)})
    if not product or product.get("stock_quantity", 0) < quantity:
        return False
    return True