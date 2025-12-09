import cloudinary
import cloudinary.uploader
from dotenv import load_dotenv
import os

load_dotenv()

# Configure Cloudinary
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

def upload_image(file, folder="beads_products"):
    """
    Upload image to Cloudinary
    Args:
        file: File object to upload
        folder: Folder name in Cloudinary (default: beads_products)
    Returns:
        dict: Upload result with secure_url
    """
    try:
        result = cloudinary.uploader.upload(
            file,
            folder=folder,
            resource_type="auto"
        )
        return {
            "success": True,
            "url": result.get("secure_url"),
            "public_id": result.get("public_id")
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

def delete_image(public_id):
    """
    Delete image from Cloudinary
    Args:
        public_id: Public ID of the image to delete
    Returns:
        dict: Deletion result
    """
    try:
        result = cloudinary.uploader.destroy(public_id)
        return {
            "success": True,
            "result": result
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }
