from app.core.database import client
from bson.objectid import ObjectId
from datetime import datetime

def create_review(product_id, user_id, review_data):
	review_dict = review_data.dict()
	review_dict["product_id"] = product_id
	review_dict["user_id"] = user_id
	review_dict["is_approved"] = False
	review_dict["helpful"] = []
	review_dict["created_at"] = datetime.utcnow()
	# Fetch username
	user = db["users"].find_one({"_id": ObjectId(user_id)})
	review_dict["username"] = user["username"] if user and "username" in user else "Unknown"
	review_dict["is_verified_purchase"] = False  # Default, add logic if needed
	result = db["reviews"].insert_one(review_dict)
	review_dict["_id"] = str(result.inserted_id)
	review_dict["helpful_count"] = 0
	# Update product's review list and review count
	db["products"].update_one(
		{"_id": ObjectId(product_id)},
		{
			"$push": {"reviews": review_dict["_id"]},
			"$inc": {"review_count": 1}
		}
	)
	return review_dict

def get_review_by_id(review_id):
	review = db["reviews"].find_one({"_id": ObjectId(review_id)})
	if review:
		review["_id"] = str(review["_id"])
		# Fetch username
		user = db["users"].find_one({"_id": ObjectId(review["user_id"])})
		review["username"] = user["username"] if user and "username" in user else "Unknown"
		review["is_verified_purchase"] = review.get("is_verified_purchase", False)
		review["helpful_count"] = len(review.get("helpful", []))
		review["created_at"] = review.get("created_at", datetime.utcnow())
	return review

def get_product_reviews(product_id, skip=0, limit=20):
	reviews = list(db["reviews"].find({"product_id": product_id}).skip(skip).limit(limit))
	for review in reviews:
		review["_id"] = str(review["_id"])
		user = db["users"].find_one({"_id": ObjectId(review["user_id"])})
		review["username"] = user["username"] if user and "username" in user else "Unknown"
		review["is_verified_purchase"] = review.get("is_verified_purchase", False)
		review["helpful_count"] = len(review.get("helpful", []))
		review["created_at"] = review.get("created_at", datetime.utcnow())
	return reviews

def update_review(review_id, user_id, review_update):
	result = db["reviews"].update_one(
		{"_id": ObjectId(review_id), "user_id": user_id},
		{"$set": review_update.dict(exclude_unset=True)}
	)
	if result.modified_count:
		return get_review_by_id(review_id)
	return None

def delete_review(review_id, user_id):
	result = db["reviews"].delete_one({"_id": ObjectId(review_id), "user_id": user_id})
	return result.deleted_count > 0

def mark_review_helpful(review_id, user_id, action):
	review = db["reviews"].find_one({"_id": ObjectId(review_id)})
	if not review:
		return None
	helpful = set(review.get("helpful", []))
	if action == "add":
		helpful.add(user_id)
	elif action == "remove":
		helpful.discard(user_id)
	db["reviews"].update_one({"_id": ObjectId(review_id)}, {"$set": {"helpful": list(helpful)}})
	return get_review_by_id(review_id)

def update_review_approval(review_id, is_approved):
	result = db["reviews"].update_one(
		{"_id": ObjectId(review_id)},
		{"$set": {"is_approved": is_approved}}
	)
	if result.modified_count:
		return get_review_by_id(review_id)
	return None


db = client['beads_db']  # Use your DB name here
