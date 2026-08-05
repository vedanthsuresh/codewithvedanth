from pydantic import BaseModel, Field
from typing import Optional, List
from enum import Enum
from sqlalchemy import Column, String, JSON, Integer
from sqlalchemy.ext.declarative import declarative_base

# Pydantic models for API
class LearningPath(str, Enum):
    PYTHON = "python"
    WEB_DEVELOPMENT = "web_development"
    MOBILE_DEVELOPMENT = "mobile_development"


# Unit models
class UnitBase(BaseModel):
    path_id: LearningPath
    title: str
    description: str = ""
    order: int = 0


class UnitCreate(UnitBase):
    pass


class UnitUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    order: Optional[int] = None


class Unit(UnitBase):
    id: str

    class Config:
        from_attributes = True


# Module models
class ModuleBase(BaseModel):
    path_id: LearningPath
    unit_id: Optional[str] = None
    title: str
    description: str
    difficulty_level: str = Field(..., description="beginner, intermediate, or advanced")
    objectives: List[str]
    prerequisites: List[str] = []
    order: int = 0


class ModuleCreate(ModuleBase):
    pass


class ModuleUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    difficulty_level: Optional[str] = None
    objectives: Optional[List[str]] = None
    prerequisites: Optional[List[str]] = None
    unit_id: Optional[str] = None
    order: Optional[int] = None


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


class UnitORM(Base):
    """SQLAlchemy ORM model for Unit"""
    __tablename__ = "units"

    id = Column(String, primary_key=True)
    path_id = Column(String, nullable=False, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False, default="")
    order = Column(Integer, nullable=False, default=0)

    def to_pydantic(self) -> Unit:
        """Convert ORM model to Pydantic model"""
        return Unit(
            id=self.id,
            path_id=self.path_id,
            title=self.title,
            description=self.description,
            order=self.order
        )

    @classmethod
    def from_pydantic(cls, unit: Unit) -> "UnitORM":
        """Create ORM model from Pydantic model"""
        return cls(
            id=unit.id,
            path_id=unit.path_id,
            title=unit.title,
            description=unit.description,
            order=unit.order
        )


class ModuleORM(Base):
    """SQLAlchemy ORM model for Module"""
    __tablename__ = "modules"

    id = Column(String, primary_key=True)
    path_id = Column(String, nullable=False, index=True)
    unit_id = Column(String, nullable=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    difficulty_level = Column(String, nullable=False)
    objectives = Column(JSON, nullable=False, default=list)
    prerequisites = Column(JSON, nullable=False, default=list)
    order = Column(Integer, nullable=False, default=0)

    def to_pydantic(self) -> Module:
        """Convert ORM model to Pydantic model"""
        return Module(
            id=self.id,
            path_id=self.path_id,
            unit_id=self.unit_id,
            title=self.title,
            description=self.description,
            difficulty_level=self.difficulty_level,
            objectives=self.objectives or [],
            prerequisites=self.prerequisites or [],
            order=self.order
        )

    @classmethod
    def from_pydantic(cls, module: Module) -> "ModuleORM":
        """Create ORM model from Pydantic model"""
        return cls(
            id=module.id,
            path_id=module.path_id,
            unit_id=module.unit_id,
            title=module.title,
            description=module.description,
            difficulty_level=module.difficulty_level,
            objectives=module.objectives,
            prerequisites=module.prerequisites,
            order=module.order
        )
