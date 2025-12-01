
from app.core.database import client
from app.models.product.product_category_model import Category
from app.schemas.product.category_schemas import CategoryCreate, CategoryUpdate
from bson import ObjectId
from datetime import datetime

db = client['beads_db']  # Use your DB name here
collection = db['categories']

def get_all_categories():
	from datetime import datetime
	categories = list(collection.find())
	result = []
	for cat in categories:
		cat['_id'] = str(cat['_id'])
		if 'created_at' not in cat:
			cat['created_at'] = datetime.min
		result.append(Category(**cat))
	return result

def get_category_by_id(category_id: str):
	from datetime import datetime
	cat = collection.find_one({'_id': ObjectId(category_id)})
	if cat:
		cat['_id'] = str(cat['_id'])
		if 'created_at' not in cat:
			cat['created_at'] = datetime.min
		return Category(**cat)
	return None

def create_category(category: CategoryCreate):
	data = category.dict()
	data['created_at'] = datetime.utcnow()
	result = collection.insert_one(data)
	return Category(**{**data, '_id': str(result.inserted_id)})

def update_category(category_id: str, category: CategoryUpdate):
	update_data = {k: v for k, v in category.dict().items() if v is not None}
	collection.update_one({'_id': ObjectId(category_id)}, {'$set': update_data})
	updated = collection.find_one({'_id': ObjectId(category_id)})
	if updated:
		updated['_id'] = str(updated['_id'])
		return Category(**updated)
	return None

def toggle_category_active(category_id: str):
	cat = collection.find_one({'_id': ObjectId(category_id)})
	if not cat:
		return None
	new_status = not cat.get('is_active', True)
	collection.update_one({'_id': ObjectId(category_id)}, {'$set': {'is_active': new_status}})
	updated = collection.find_one({'_id': ObjectId(category_id)})
	if updated:
		updated['_id'] = str(updated['_id'])
		return Category(**updated)
	return None

def delete_category(category_id: str):
	result = collection.delete_one({'_id': ObjectId(category_id)})
	return result.deleted_count > 0