from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import List
from app.core.cloudinary_config import upload_image, delete_image

router = APIRouter(
    prefix='/upload',
    tags=['Upload']
)

@router.post('/image')
async def upload_single_image(file: UploadFile = File(...)):
    """
    Upload a single image to Cloudinary
    """
    try:
        # Read file content
        contents = await file.read()
        
        # Upload to Cloudinary
        result = upload_image(contents, folder="beads_products")
        
        if result["success"]:
            return {
                "success": True,
                "url": result["url"],
                "public_id": result["public_id"]
            }
        else:
            raise HTTPException(status_code=400, detail=result["error"])
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post('/images')
async def upload_multiple_images(files: List[UploadFile] = File(...)):
    """
    Upload multiple images to Cloudinary
    """
    uploaded_urls = []
    errors = []
    
    for file in files:
        try:
            contents = await file.read()
            result = upload_image(contents, folder="beads_products")
            
            if result["success"]:
                uploaded_urls.append({
                    "filename": file.filename,
                    "url": result["url"],
                    "public_id": result["public_id"]
                })
            else:
                errors.append({
                    "filename": file.filename,
                    "error": result["error"]
                })
        except Exception as e:
            errors.append({
                "filename": file.filename,
                "error": str(e)
            })
    
    return {
        "success": len(uploaded_urls) > 0,
        "uploaded": uploaded_urls,
        "errors": errors
    }

@router.delete('/image/{public_id:path}')
async def delete_cloudinary_image(public_id: str):
    """
    Delete an image from Cloudinary
    """
    try:
        result = delete_image(public_id)
        
        if result["success"]:
            return {"success": True, "message": "Image deleted successfully"}
        else:
            raise HTTPException(status_code=400, detail=result["error"])
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
