from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional, List
from datetime import datetime, date
from uuid import UUID

class UserBase(BaseModel):
    email: EmailStr
    name: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: UUID
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class ProfileBase(BaseModel):
    gender: Optional[str] = None
    weight_kg: Optional[float] = None
    height_cm: Optional[float] = None
    birth_date: Optional[date] = None
    activity_level: Optional[str] = None
    goal_type: Optional[str] = None

class Profile(ProfileBase):
    id: UUID
    user_id: UUID
    model_config = ConfigDict(from_attributes=True)

class GoalBase(BaseModel):
    calories: int
    protein: int
    carbs: int
    fat: int
    water_ml: int

class Goal(GoalBase):
    id: UUID
    user_id: UUID
    model_config = ConfigDict(from_attributes=True)

class MealBase(BaseModel):
    name: str
    meal_type: str
    calories: int
    protein: float
    carbs: float
    fat: float

class MealCreate(MealBase):
    pass

class Meal(MealBase):
    id: UUID
    logged_at: datetime
    model_config = ConfigDict(from_attributes=True)

class WeightLogCreate(BaseModel):
    weight: float

class WeightLog(BaseModel):
    id: UUID
    weight: float
    recorded_at: date
    model_config = ConfigDict(from_attributes=True)

class WaterUpdate(BaseModel):
    amount_ml: int

class RecipeBase(BaseModel):
    name: str
    calories: int
    protein: float
    carbs: float
    fat: float
    ingredients: str
    instructions: str
    image_url: Optional[str] = None

class Recipe(RecipeBase):
    id: UUID
    model_config = ConfigDict(from_attributes=True)

class AIScanRequest(BaseModel):
    text: Optional[str] = None
    image_url: Optional[str] = None
