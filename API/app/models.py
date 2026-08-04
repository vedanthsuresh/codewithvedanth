from pydantic import BaseModel, Field
from typing import Optional, List
from enum import Enum


class LearningPath(str, Enum):
    PYTHON = "python"
    WEB_DEVELOPMENT = "web_development"
    MOBILE_DEVELOPMENT = "mobile_development"


class LessonBase(BaseModel):
    path_id: LearningPath
    title: str
    description: str
    age_range: str = Field(..., description="e.g., '6-9' or '10-12'")
    duration_minutes: int = Field(default=45)
    price_on_one: float = Field(default=10.0)
    price_group: float = Field(default=8.0)
    difficulty_level: str = Field(..., description="beginner, intermediate, or advanced")
    objectives: List[str]
    prerequisites: List[str] = []


class LessonCreate(LessonBase):
    pass


class LessonUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    age_range: Optional[str] = None
    difficulty_level: Optional[str] = None
    objectives: Optional[List[str]] = None
    prerequisites: Optional[List[str]] = None


class Lesson(LessonBase):
    id: str

    class Config:
        from_attributes = True


class LearningPathInfo(BaseModel):
    id: LearningPath
    name: str
    description: str
    icon: str
    color: str
