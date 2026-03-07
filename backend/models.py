from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Date, Integer
from sqlalchemy.orm import relationship
import datetime
import uuid
from sqlalchemy.dialects.postgresql import UUID
from database import Base
class User(Base):
    __tablename__ = 'users'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True)
    name = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    profile = relationship('Profile', back_populates='user', uselist=False)
    meals = relationship('MealLog', back_populates='user')
    goals = relationship('DailyGoal', back_populates='user', uselist=False)
    weight_logs = relationship('WeightHistory', back_populates='user')
    water_logs = relationship('WaterLog', back_populates='user')

class Profile(Base):
    __tablename__ = 'profiles'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'), unique=True, nullable=False)
    gender = Column(String)
    weight_kg = Column(Float)
    height_cm = Column(Float)
    birth_date = Column(Date)
    activity_level = Column(String)
    goal_type = Column(String)
    
    user = relationship('User', back_populates='profile')

class DailyGoal(Base):
    __tablename__ = 'daily_goals'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'), unique=True, nullable=False)
    calories = Column(Integer, default=2000)
    protein = Column(Integer, default=150)
    carbs = Column(Integer, default=250)
    fat = Column(Integer, default=65)
    water_ml = Column(Integer, default=2000)
    
    user = relationship('User', back_populates='goals')

class MealLog(Base):
    __tablename__ = 'meal_logs'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'))
    name = Column(String)
    meal_type = Column(String)
    calories = Column(Integer, default=0)
    protein = Column(Float, default=0.0)
    carbs = Column(Float, default=0.0)
    fat = Column(Float, default=0.0)
    logged_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    user = relationship('User', back_populates='meals')

class WeightHistory(Base):
    __tablename__ = 'weight_history'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'))
    weight = Column(Float)
    recorded_at = Column(Date, default=datetime.date.today)
    
    user = relationship('User', back_populates='weight_logs')

class WaterLog(Base):
    __tablename__ = 'water_logs'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'))
    amount_ml = Column(Integer)
    recorded_at = Column(Date, default=datetime.date.today)
    
    user = relationship('User', back_populates='water_logs')

class Recipe(Base):
    __tablename__ = 'recipes'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String)
    calories = Column(Integer)
    protein = Column(Float)
    carbs = Column(Float)
    fat = Column(Float)
    ingredients = Column(String)
    instructions = Column(String)
    image_url = Column(String, nullable=True)
