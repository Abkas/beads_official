from app.core.database import client
from app.models.product.product_category_model import Category
from app.schemas.product.category_schemas import CategoryCreate, CategoryUpdate
from bson import ObjectId

db = client['beads_db']  # Use your DB name here
collection = db['categories']

async def get_all_categories():
	categories = list(collection.find())
	return [Category(**cat) for cat in categories]

async def get_category_by_id(category_id: str):
	cat = collection.find_one({'_id': ObjectId(category_id)})
	if cat:
		return Category(**cat)
	return None

async def create_category(category: CategoryCreate):
	data = category.dict()
	result = collection.insert_one(data)
	return Category(**{**data, '_id': result.inserted_id})

async def update_category(category_id: str, category: CategoryUpdate):
	update_data = {k: v for k, v in category.dict().items() if v is not None}
	collection.update_one({'_id': ObjectId(category_id)}, {'$set': update_data})
	updated = collection.find_one({'_id': ObjectId(category_id)})
	if updated:
		return Category(**updated)
	return None

async def toggle_category_active(category_id: str, is_active: bool):
	collection.update_one({'_id': ObjectId(category_id)}, {'$set': {'is_active': is_active}})
	updated = collection.find_one({'_id': ObjectId(category_id)})
	if updated:
		return Category(**updated)
	return None
