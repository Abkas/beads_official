from app.core.database import client
from bson.objectid import ObjectId

db = client['beads_db']

def get_all_users():
    """Get all users for admin dashboard"""
    users = list(db['users'].find())
    result = []
    for user in users:
        result.append({
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
            'addresses': user.get('addresses', [])
        })
    return result

def get_user_by_id_admin(user_id: str):
    """Get specific user by ID for admin"""
    try:
        user = db['users'].find_one({'_id': ObjectId(user_id)})
        if not user:
            return None
        
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
            'addresses': user.get('addresses', []),
            'Cart': user.get('Cart', []),
            'wishlist': user.get('wishlist', [])
        }
    except Exception:
        return None
