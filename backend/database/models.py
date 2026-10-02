from datetime import datetime
from typing import Optional, Dict, Any
from pydantic import BaseModel, Field
from bson import ObjectId


class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, field_schema):
        field_schema.update(type="string")


class UserModel(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    name: str
    email: str
    password_hash: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class UserCreate(BaseModel):
    name: str
    email: str
    password: str


class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    created_at: datetime

    class Config:
        populate_by_name = True


class PredictionModel(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    user_id: str
    image_path: str
    
    # Stage 1 results
    stage1_class: str
    stage1_confidence: float
    stage1_probabilities: Dict[str, float]
    
    # Stage 2 results
    stage2_executed: bool = False
    stage2_class: Optional[str] = None
    stage2_confidence: Optional[float] = None
    stage2_probabilities: Optional[Dict[str, float]] = None
    
    # Explainability
    gradcam_path: Optional[str] = None
    
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class PredictionCreate(BaseModel):
    user_id: str
    image_path: str
    stage1_class: str
    stage1_confidence: float
    stage1_probabilities: Dict[str, float]
    stage2_executed: bool = False
    stage2_class: Optional[str] = None
    stage2_confidence: Optional[float] = None
    stage2_probabilities: Optional[Dict[str, float]] = None
    gradcam_path: Optional[str] = None


class PredictionResponse(BaseModel):
    id: str
    user_id: str
    image_path: str
    stage1_class: str
    stage1_confidence: float
    stage1_probabilities: Dict[str, float]
    stage2_executed: bool
    stage2_class: Optional[str]
    stage2_confidence: Optional[float]
    stage2_probabilities: Optional[Dict[str, float]]
    gradcam_path: Optional[str]
    created_at: datetime

    class Config:
        populate_by_name = True
