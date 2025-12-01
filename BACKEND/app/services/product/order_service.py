from app.core.database import client
from bson.objectid import ObjectId
from datetime import datetime
from app.services.utility.coupon_service import validate_coupon


def create_order(user_id, order_data):
	order_dict = order_data.dict()
	order_dict["user_id"] = user_id
	order_dict["status"] = "pending"

	# If items not provided, use cart items
	items = order_dict.get("items", [])
	if not items:
		from app.services.user.cart_service import get_cart
		cart = get_cart(user_id)
		items = cart.get("items", [])
		order_dict["items"] = items
		order_dict["subtotal"] = cart.get("total_price", 0.0)
	else:
		order_dict["items"] = items
		order_dict["subtotal"] = order_dict.get("subtotal", 0.0)

	order_dict["shipping_cost"] = order_dict.get("shipping_cost", 0.0)

	# Coupon application (right after subtotal and shipping_cost are set, before total)
	coupon_code = order_dict.get("coupon_code")
	discount_amount = 0.0
	if coupon_code:
		coupon_result = validate_coupon(coupon_code, order_dict["subtotal"], user_id)
		if coupon_result.get("is_valid"):
			discount_amount = coupon_result.get("discount_amount", 0.0)
			order_dict["coupon_code"] = coupon_code
			order_dict["discount_amount"] = discount_amount
		else:
			order_dict["coupon_code"] = None
			order_dict["discount_amount"] = 0.0
	else:
		order_dict["discount_amount"] = 0.0
	# Apply discount to total
	order_dict["total"] = order_dict["subtotal"] + order_dict["shipping_cost"] - order_dict["discount_amount"]

	# If no shipping_address provided, use user's default address
	shipping_address = order_dict.get("shipping_address")
	if not shipping_address:
		default_addr = db["addresses"].find_one({"user_id": user_id, "is_default": True})
		if default_addr:
			default_addr["_id"] = str(default_addr["_id"])
			order_dict["shipping_address"] = default_addr
		else:
			order_dict["shipping_address"] = {}
	else:
		order_dict["shipping_address"] = shipping_address

	order_dict["payment_status"] = order_dict.get("payment_status", "unpaid")
	order_dict["created_at"] = datetime.utcnow()
	result = db["orders"].insert_one(order_dict)
	return get_order_by_id(str(result.inserted_id), user_id)

def get_user_orders(user_id):
	orders = list(db["orders"].find({"user_id": user_id}))
	order_list = []
	for order in orders:
		order_item = {
			"id": str(order.get("_id")),
			"total": order.get("total", 0.0),
			"status": order.get("status", "pending"),
			"payment_status": order.get("payment_status", "unpaid"),
			"created_at": order.get("created_at"),
			"item_count": len(order.get("items", []))
		}
		order_list.append(order_item)
	return order_list

def get_order_by_id(order_id, user_id):
	order = db["orders"].find_one({"_id": ObjectId(order_id), "user_id": user_id})
	if not order:
		return None
	response = {
		"id": str(order.get("_id")),
		"user_id": order.get("user_id", ""),
		"items": order.get("items", []),
		"subtotal": order.get("subtotal", 0.0),
		"shipping_cost": order.get("shipping_cost", 0.0),
		"discount_amount": order.get("discount_amount", 0.0),
		"coupon_code": order.get("coupon_code", None),
		"total": order.get("total", 0.0),
		"shipping_address": order.get("shipping_address", {}),
		"status": order.get("status", "pending"),
		"payment_status": order.get("payment_status", "unpaid"),
		"created_at": order.get("created_at"),
		"item_count": len(order.get("items", []))
	}
	return response

def cancel_order(order_id, user_id):
	result = db["orders"].update_one(
		{"_id": ObjectId(order_id), "user_id": user_id},
		{"$set": {"status": "cancelled"}}
	)
	if result.modified_count:
		return get_order_by_id(order_id, user_id)
	return None

def get_all_orders(status_filter=None, limit=50):
	query = {}
	if status_filter:
		query["status"] = status_filter
	orders = list(db["orders"].find(query).limit(limit))
	order_list = []
	for order in orders:
		order_item = {
			"id": str(order.get("_id")),
			"total": order.get("total", 0.0),
			"status": order.get("status", "pending"),
			"payment_status": order.get("payment_status", "unpaid"),
			"created_at": order.get("created_at"),
			"item_count": len(order.get("items", []))
		}
		order_list.append(order_item)
	return order_list

def update_order_status(order_id, status):
	result = db["orders"].update_one(
		{"_id": ObjectId(order_id)},
		{"$set": {"status": status}}
	)
	if result.modified_count:
		return db["orders"].find_one({"_id": ObjectId(order_id)})
	return None

def update_payment_status(order_id, payment_status):
	result = db["orders"].update_one(
		{"_id": ObjectId(order_id)},
		{"$set": {"payment_status": payment_status}}
	)
	if result.modified_count:
		order = db["orders"].find_one({"_id": ObjectId(order_id)})
		if order:
			response = {
				"id": str(order.get("_id")),
				"user_id": order.get("user_id", ""),
				"items": order.get("items", []),
				"subtotal": order.get("subtotal", 0.0),
				"shipping_cost": order.get("shipping_cost", 0.0),
				"total": order.get("total", 0.0),
				"shipping_address": order.get("shipping_address", {}),
				"status": order.get("status", "pending"),
				"payment_status": order.get("payment_status", "unpaid"),
				"created_at": order.get("created_at"),
				"item_count": len(order.get("items", []))
			}
			return response
	return None

db = client['beads_db']  # Use your DB name here
