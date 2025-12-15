
from app.core.database import client
from app.models.product.product_category_model import Category
from app.schemas.product.category_schemas import CategoryCreate, CategoryUpdate
from bson import ObjectId
from datetime import datetime

db = client['beads_db']  # Use your DB name here
collection = db['categories']
products_collection = db['products']

def get_all_categories():
	from datetime import datetime
	categories = list(collection.find())
	result = []
	for cat in categories:
		cat['_id'] = str(cat['_id'])
		if 'created_at' not in cat:
			cat['created_at'] = datetime.min
		# Count products in this category
		product_count = products_collection.count_documents({'category': cat['name']})
		cat['product_count'] = product_count
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
	
	# Get the old category name before updating
	old_category = collection.find_one({'_id': ObjectId(category_id)})
	if not old_category:
		return None
	
	old_name = old_category.get('name')
	new_name = update_data.get('name')
	
	# Update the category
	collection.update_one({'_id': ObjectId(category_id)}, {'$set': update_data})
	
	# If category name changed, update all products with this category
	if new_name and old_name != new_name:
		products_collection.update_many(
			{'category': old_name},
			{'$set': {'category': new_name}}
		)
	
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
	# Get category name before deleting
	category = collection.find_one({'_id': ObjectId(category_id)})
	if not category:
		return False
	
	# Check if category has products
	product_count = products_collection.count_documents({'category': category.get('name')})
	if product_count > 0:
		raise ValueError(f"Cannot delete category. It has {product_count} products.")
	
	result = collection.delete_one({'_id': ObjectId(category_id)})
	return result.deleted_count > 0

def get_category_products(category_id: str):
	"""Get all products under a specific category"""
	category = collection.find_one({'_id': ObjectId(category_id)})
	if not category:
		return None
	
	category_name = category.get('name')
	products = list(products_collection.find({'category': category_name}))
	
	# Format products
	for product in products:
		product['_id'] = str(product['_id'])
	
	return {
		'category': {
			'id': str(category['_id']),
			'name': category_name,
			'slug': category.get('slug', ''),
		},
		'products': products,
		'total': len(products)
	}