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
        
        # Fetch order count from orders collection
        order_count = db['orders'].count_documents({'user_id': user_id})
        
        # Fetch cart items count from carts collection
        cart = db['carts'].find_one({'user_id': user_id})
        cart_count = len(cart.get('items', [])) if cart else 0
        
        # Fetch wishlist items count from wishlists collection
        wishlist = db['wishlists'].find_one({'user_id': user_id})
        wishlist_count = len(wishlist.get('product_ids', [])) if wishlist else 0
        
        # Fetch actual orders for order history
        orders = list(db['orders'].find({'user_id': user_id}).sort('created_at', -1).limit(10))
        order_list = []
        for order in orders:
            order_list.append({
                'id': str(order['_id']),
                'total': order.get('total', 0.0),
                'status': order.get('status', 'pending'),
                'payment_status': order.get('payment_status', 'unpaid'),
                'created_at': order.get('created_at'),
                'item_count': len(order.get('items', []))
            })
        
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
            'total_orders': order_count,
            'cart_items': cart_count,
            'wishlist_items': wishlist_count,
            'orders': order_list,
            'addresses': addresses
        }
    except Exception:
        return None
