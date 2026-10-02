from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId
from pydantic import BaseModel

from database.database import get_database
from database.models import UserResponse
from routes.auth import get_current_user_from_token
from utils.security import get_password_hash, verify_password

router = APIRouter()


class ProfileUpdate(BaseModel):
    name: str


class PasswordChange(BaseModel):
    current_password: str
    new_password: str


@router.get("/profile", response_model=UserResponse)
async def get_profile(
    current_user_id: str = Depends(get_current_user_from_token),
    db=Depends(get_database)
):
    """Get current user profile."""
    user = await db.users.find_one({"_id": ObjectId(current_user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return UserResponse(
        id=str(user["_id"]),
        name=user["name"],
        email=user["email"],
        created_at=user["created_at"]
    )


@router.put("/profile", response_model=UserResponse)
async def update_profile(
    profile_data: ProfileUpdate,
    current_user_id: str = Depends(get_current_user_from_token),
    db=Depends(get_database)
):
    """Update user profile."""
    user = await db.users.find_one({"_id": ObjectId(current_user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update name
    await db.users.update_one(
        {"_id": ObjectId(current_user_id)},
        {"$set": {"name": profile_data.name}}
    )
    
    updated_user = await db.users.find_one({"_id": ObjectId(current_user_id)})
    
    return UserResponse(
        id=str(updated_user["_id"]),
        name=updated_user["name"],
        email=updated_user["email"],
        created_at=updated_user["created_at"]
    )


@router.put("/change-password")
async def change_password(
    password_data: PasswordChange,
    current_user_id: str = Depends(get_current_user_from_token),
    db=Depends(get_database)
):
    """Change user password."""
    user = await db.users.find_one({"_id": ObjectId(current_user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Verify current password
    if not verify_password(password_data.current_password, user["password_hash"]):
        raise HTTPException(status_code=400, detail="Incorrect current password")
    
    # Update password
    new_password_hash = get_password_hash(password_data.new_password)
    await db.users.update_one(
        {"_id": ObjectId(current_user_id)},
        {"$set": {"password_hash": new_password_hash}}
    )
    
    return {"message": "Password changed successfully"}


@router.get("/stats")
async def get_user_stats(
    current_user_id: str = Depends(get_current_user_from_token),
    db=Depends(get_database)
):
    """Get user statistics."""
    total_predictions = await db.predictions.count_documents({"user_id": current_user_id})
    skin_predictions = await db.predictions.count_documents({
        "user_id": current_user_id,
        "stage1_class": "SKIN"
    })
    non_skin_predictions = await db.predictions.count_documents({
        "user_id": current_user_id,
        "stage1_class": "NON_SKIN"
    })
    
    return {
        "total_predictions": total_predictions,
        "skin_predictions": skin_predictions,
        "non_skin_predictions": non_skin_predictions
    }
