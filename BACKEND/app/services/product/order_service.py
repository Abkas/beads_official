from app.core.database import client
from bson.objectid import ObjectId
from datetime import datetime
from app.services.utility.coupon_service import validate_coupon

db = client['beads_db']


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
		# Enrich items with product images
		enriched_items = []
		for item in items:
			enriched_item = dict(item)
			if "product_image" not in enriched_item or not enriched_item.get("product_image"):
				product_id = item.get("product_id")
				if product_id:
					product = db["products"].find_one({"_id": ObjectId(product_id)})
					if product:
						image_urls = product.get("image_urls", [])
						enriched_item["product_image"] = image_urls[0] if image_urls else None
			enriched_items.append(enriched_item)
		order_dict["items"] = enriched_items
		order_dict["subtotal"] = cart.get("total_price", 0.0)
	else:
		# Enrich provided items with product images
		enriched_items = []
		for item in items:
			enriched_item = dict(item)
			if "product_image" not in enriched_item or not enriched_item.get("product_image"):
				product_id = item.get("product_id")
				if product_id:
					product = db["products"].find_one({"_id": ObjectId(product_id)})
					if product:
						image_urls = product.get("image_urls", [])
						enriched_item["product_image"] = image_urls[0] if image_urls else None
			enriched_items.append(enriched_item)
		order_dict["items"] = enriched_items
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

	# Handle shipping address
	shipping_address = order_dict.get("shipping_address")
	address_index = order_dict.get("address_index")
	
	if not shipping_address:
		if address_index is not None:
			# Get address by index from user's addresses
			user_addresses = list(db["addresses"].find({"user_id": user_id}))
			if 0 <= address_index < len(user_addresses):
				selected_addr = user_addresses[address_index]
				# Convert ObjectId to string and prepare address dict
				shipping_address = {
					"id": str(selected_addr.get("_id")),
					"full_name": selected_addr.get("full_name", ""),
					"phone_number": selected_addr.get("phone_number", ""),
					"address_type": selected_addr.get("address_type", ""),
					"country": selected_addr.get("country", ""),
					"province": selected_addr.get("province", ""),
					"district": selected_addr.get("district", ""),
					"city": selected_addr.get("city", ""),
					"tole": selected_addr.get("tole", ""),
					"landmark": selected_addr.get("landmark", ""),
				}
				order_dict["shipping_address"] = shipping_address
			else:
				raise Exception("Invalid address index")
		else:
			# Use default address
			default_addr = db["addresses"].find_one({"user_id": user_id, "is_default": True})
			if default_addr:
				shipping_address = {
					"id": str(default_addr.get("_id")),
					"full_name": default_addr.get("full_name", ""),
					"phone_number": default_addr.get("phone_number", ""),
					"address_type": default_addr.get("address_type", ""),
					"country": default_addr.get("country", ""),
					"province": default_addr.get("province", ""),
					"district": default_addr.get("district", ""),
					"city": default_addr.get("city", ""),
					"tole": default_addr.get("tole", ""),
					"landmark": default_addr.get("landmark", ""),
				}
				order_dict["shipping_address"] = shipping_address
			else:
				order_dict["shipping_address"] = {}
	else:
		order_dict["shipping_address"] = shipping_address
	
	# Remove address_index from order_dict as it's not needed in the database
	order_dict.pop("address_index", None)

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
	
	# Enrich items with product images
	items = order.get("items", [])
	enriched_items = []
	for item in items:
		enriched_item = dict(item)
		# Fetch product image if not already present
		if "product_image" not in enriched_item or not enriched_item.get("product_image"):
			product_id = item.get("product_id")
			if product_id:
				product = db["products"].find_one({"_id": ObjectId(product_id)})
				if product:
					image_urls = product.get("image_urls", [])
					enriched_item["product_image"] = image_urls[0] if image_urls else None
		enriched_items.append(enriched_item)
	
	response = {
		"id": str(order.get("_id")),
		"user_id": order.get("user_id", ""),
		"items": enriched_items,
		"subtotal": order.get("subtotal", 0.0),
		"shipping_cost": order.get("shipping_cost", 0.0),
		"discount_amount": order.get("discount_amount", 0.0),
		"coupon_code": order.get("coupon_code", None),
		"total": order.get("total", 0.0),
		"shipping_address": order.get("shipping_address", {}),
		"payment_method": order.get("payment_method", "cod"),
		"status": order.get("status", "pending"),
		"payment_status": order.get("payment_status", "unpaid"),
		"created_at": order.get("created_at"),
		"item_count": len(order.get("items", []))
	}
	return response

def get_order_by_id_admin(order_id):
	"""Get order by ID for admin - no user_id restriction"""
	order = db["orders"].find_one({"_id": ObjectId(order_id)})
	if not order:
		return None
	
	# Enrich items with product images
	items = order.get("items", [])
	enriched_items = []
	for item in items:
		enriched_item = dict(item)
		# Fetch product image if not already present
		if "product_image" not in enriched_item or not enriched_item.get("product_image"):
			product_id = item.get("product_id")
			if product_id:
				product = db["products"].find_one({"_id": ObjectId(product_id)})
				if product:
					image_urls = product.get("image_urls", [])
					enriched_item["product_image"] = image_urls[0] if image_urls else None
		enriched_items.append(enriched_item)
	
	response = {
		"id": str(order.get("_id")),
		"user_id": order.get("user_id", ""),
		"items": enriched_items,
		"subtotal": order.get("subtotal", 0.0),
		"shipping_cost": order.get("shipping_cost", 0.0),
		"discount_amount": order.get("discount_amount", 0.0),
		"coupon_code": order.get("coupon_code", None),
		"total": order.get("total", 0.0),
		"shipping_address": order.get("shipping_address", {}),
		"payment_method": order.get("payment_method", "cod"),
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
		return get_order_by_id_admin(order_id)
	return None

def update_payment_status(order_id, payment_status):
	result = db["orders"].update_one(
		{"_id": ObjectId(order_id)},
		{"$set": {"payment_status": payment_status}}
	)
	if result.modified_count:
		return get_order_by_id_admin(order_id)
	return None

db = client['beads_db']  # Use your DB name here
