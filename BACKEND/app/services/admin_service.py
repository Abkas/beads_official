from app.core.database import client
from bson.objectid import ObjectId

db = client['beads_db']

def get_all_users():
    """Get all users for admin dashboard"""
    users = list(db['users'].find())
    result = []
    for user in users:
        user_id = str(user['_id'])
        
        # Fetch addresses from addresses collection
        addresses = list(db['addresses'].find({'user_id': user_id}))
        for addr in addresses:
            addr['id'] = str(addr['_id'])
            del addr['_id']
            addr.setdefault('is_default', False)
        
        result.append({
            'id': user_id,
            'username': user.get('username', ''),
            'email': user.get('email', ''),
            'firstname': user.get('firstname', ''),
            'lastname': user.get('lastname', ''),
            'phone': user.get('phone'),
            'profile_image': user.get('profile_image'),
            'is_verified': user.get('is_verified', False),
            'is_active': user.get('is_active', True),
            'is_admin': user.get('is_admin', False),
            'created_at': user.get('created_at'),
            'last_login': user.get('last_login'),
            'order_history': user.get('order_history', []),
            'addresses': addresses
        })
    return result

def get_user_by_id_admin(user_id: str):
    """Get specific user by ID for admin"""
    try:
        user = db['users'].find_one({'_id': ObjectId(user_id)})
        if not user:
            return None
        
        # Fetch addresses from addresses collection
        addresses = list(db['addresses'].find({'user_id': user_id}))
        for addr in addresses:
            addr['id'] = str(addr['_id'])
            del addr['_id']
            addr.setdefault('is_default', False)
        
        return {
            'id': str(user['_id']),
            'username': user.get('username', ''),
            'email': user.get('email', ''),
            'firstname': user.get('firstname', ''),
            'lastname': user.get('lastname', ''),
            'phone': user.get('phone'),
            'profile_image': user.get('profile_image'),
            'is_verified': user.get('is_verified', False),
            'is_active': user.get('is_active', True),
            'is_admin': user.get('is_admin', False),
            'created_at': user.get('created_at'),
            'last_login': user.get('last_login'),
            'order_history': user.get('order_history', []),
            'addresses': addresses,
            'Cart': user.get('Cart', []),
            'wishlist': user.get('wishlist', [])
        }
    except Exception:
        return None
