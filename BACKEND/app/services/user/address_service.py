
from app.core.database import client
from bson.objectid import ObjectId
db = client['beads_db']  # Use your DB name here


def get_address(user_id):
    addresses = list(db['addresses'].find({'user_id': user_id}))    
    for addr in addresses:
        addr['_id'] = str(addr['_id'])
    return addresses

def add_address(user_id, address_data):
    address_dict = address_data.dict()
    address_dict['user_id'] = user_id
    result = db['addresses'].insert_one(address_dict)
    address = db['addresses'].find_one({'_id': result.inserted_id})
    address['_id'] = str(address['_id'])  
    return address

def update_address(address_id, user_id, update_data):
    result = db["addresses"].update_one(
        {"_id": ObjectId(address_id), "user_id": user_id},
        {"$set": update_data.dict(exclude_unset=True)}
    )
    # If setting is_default to True, unset previous default
    if update_data.get("is_default"):
        db["addresses"].update_many({"user_id": user_id, "is_default": True}, {"$set": {"is_default": False}})
        # Ensure only the updated address is set as default
        update_data["is_default"] = True
    elif "is_default" in update_data and not update_data["is_default"]:
        # If explicitly unsetting default, just update this address
        update_data["is_default"] = False
    result = db["addresses"].update_one({"_id": ObjectId(address_id), "user_id": user_id}, {"$set": update_data.dict(exclude_unset=True)})
    return result.modified_count > 0

def get_address_by_id(address_id, user_id):
    address = db["addresses"].find_one({"_id": ObjectId(address_id), "user_id": user_id})
    if address:
        address["_id"] = str(address["_id"])
    return address

def delete_address(address_id, user_id):
    result = db["addresses"].delete_one({"_id": ObjectId(address_id), "user_id": user_id})
    return result.deleted_count > 0

def set_default_address(user_id, address_id):
    # Unset previous default
    db["addresses"].update_many({"user_id": user_id, "is_default": True}, {"$set": {"is_default": False}})
    # Set new default
    result = db["addresses"].update_one({"_id": ObjectId(address_id), "user_id": user_id}, {"$set": {"is_default": True}})
    return result.modified_count > 0