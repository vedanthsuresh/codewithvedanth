from pydantic import BaseModel, Field
from typing import Optional, List
from enum import Enum
from sqlalchemy import Column, String, Integer, Float, JSON
from sqlalchemy.ext.declarative import declarative_base

# Pydantic models for API
class LearningPath(str, Enum):
    PYTHON = "python"
    WEB_DEVELOPMENT = "web_development"
    MOBILE_DEVELOPMENT = "mobile_development"


class ModuleBase(BaseModel):
    path_id: LearningPath
    title: str
    description: str
    age_range: str = Field(..., description="e.g., '6-9' or '10-12'")
    duration_minutes: int = Field(default=45, description="Estimated duration in minutes (guideline, not fixed)")
    price_on_one: float = Field(default=10.0)
    price_group: float = Field(default=8.0)
    difficulty_level: str = Field(..., description="beginner, intermediate, or advanced")
    objectives: List[str]
    prerequisites: List[str] = []


class ModuleCreate(ModuleBase):
    pass


class ModuleUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    age_range: Optional[str] = None
    difficulty_level: Optional[str] = None
    objectives: Optional[List[str]] = None
    prerequisites: Optional[List[str]] = None


class Module(ModuleBase):
    id: str

    class Config:
        from_attributes = True


class LearningPathInfo(BaseModel):
    id: LearningPath
    name: str
    description: str
    icon: str
    color: str


# SQLAlchemy ORM models
Base = declarative_base()


class ModuleORM(Base):
    """SQLAlchemy ORM model for Module"""
    __tablename__ = "modules"

    id = Column(String, primary_key=True)
    path_id = Column(String, nullable=False, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    age_range = Column(String, nullable=False)
    duration_minutes = Column(Integer, nullable=False, default=45)
    price_on_one = Column(Float, nullable=False, default=10.0)
    price_group = Column(Float, nullable=False, default=8.0)
    difficulty_level = Column(String, nullable=False)
    objectives = Column(JSON, nullable=False, default=list)
    prerequisites = Column(JSON, nullable=False, default=list)

    def to_pydantic(self) -> Module:
        """Convert ORM model to Pydantic model"""
        return Module(
            id=self.id,
            path_id=self.path_id,
            title=self.title,
            description=self.description,
            age_range=self.age_range,
            duration_minutes=self.duration_minutes,
            price_on_one=self.price_on_one,
            price_group=self.price_group,
            difficulty_level=self.difficulty_level,
            objectives=self.objectives or [],
            prerequisites=self.prerequisites or []
        )

    @classmethod
    def from_pydantic(cls, module: Module) -> "ModuleORM":
        """Create ORM model from Pydantic model"""
        return cls(
            id=module.id,
            path_id=module.path_id,
            title=module.title,
            description=module.description,
            age_range=module.age_range,
            duration_minutes=module.duration_minutes,
            price_on_one=module.price_on_one,
            price_group=module.price_group,
            difficulty_level=module.difficulty_level,
            objectives=module.objectives,
            prerequisites=module.prerequisites
        )
