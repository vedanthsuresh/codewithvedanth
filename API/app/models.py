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


# ============ TIME SLOT MODELS ============

class TimeSlotBase(BaseModel):
    date: str  # ISO date format YYYY-MM-DD
    time: str  # HH:MM format (24-hour)
    capacity: int = Field(default=1, ge=1, le=20)


class TimeSlotCreate(TimeSlotBase):
    pass


class TimeSlotUpdate(BaseModel):
    date: Optional[str] = None
    time: Optional[str] = None
    capacity: Optional[int] = Field(default=None, ge=1, le=20)


class TimeSlot(TimeSlotBase):
    id: str
    available: bool  # Derived field: bookings_count < capacity

    class Config:
        from_attributes = True


# ============ BOOKING MODELS ============

class BookingBase(BaseModel):
    time_slot_id: str
    user_id: str  # Firebase UID
    student_name: str
    student_email: str
    student_phone: str
    student_age: int = Field(..., ge=6, le=18)


class BookingCreate(BookingBase):
    pass


class Booking(BookingBase):
    id: str
    booked_at: str
    status: str = "confirmed"  # confirmed, cancelled, completed

    class Config:
        from_attributes = True


class BookingResponse(Booking):
    """Booking with nested time slot info"""
    time_slot: TimeSlot


class BookingListAdmin(Booking):
    """Admin view with additional time slot details"""
    time_slot_date: str
    time_slot_time: str
    bookings_count: int


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


class TimeSlotORM(Base):
    """SQLAlchemy ORM model for TimeSlot"""
    __tablename__ = "time_slots"

    id = Column(String, primary_key=True)
    date = Column(String, nullable=False, index=True)
    time = Column(String, nullable=False)
    capacity = Column(Integer, nullable=False, default=1)
    created_at = Column(String, nullable=False)
    updated_at = Column(String, nullable=False)

    def to_pydantic(self, db_session) -> TimeSlot:
        """Convert ORM model to Pydantic model with availability check"""
        # Count confirmed bookings for this slot
        from sqlalchemy import func
        booking_count = db_session.query(BookingORM).filter(
            BookingORM.time_slot_id == self.id,
            BookingORM.status == "confirmed"
        ).count()

        return TimeSlot(
            id=self.id,
            date=self.date,
            time=self.time,
            capacity=self.capacity,
            available=booking_count < self.capacity
        )

    @classmethod
    def from_pydantic(cls, slot: TimeSlot) -> "TimeSlotORM":
        """Create ORM model from Pydantic model"""
        return cls(
            id=slot.id,
            date=slot.date,
            time=slot.time,
            capacity=slot.capacity,
            created_at="",
            updated_at=""
        )


class BookingORM(Base):
    """SQLAlchemy ORM model for Booking"""
    __tablename__ = "bookings"

    id = Column(String, primary_key=True)
    time_slot_id = Column(String, nullable=False, index=True)
    user_id = Column(String, nullable=False, index=True)
    student_name = Column(String, nullable=False)
    student_email = Column(String, nullable=False, index=True)
    student_phone = Column(String, nullable=False)
    student_age = Column(Integer, nullable=False)
    booked_at = Column(String, nullable=False)
    status = Column(String, nullable=False, default="confirmed")

    def to_pydantic(self) -> Booking:
        """Convert ORM model to Pydantic model"""
        return Booking(
            id=self.id,
            time_slot_id=self.time_slot_id,
            user_id=self.user_id,
            student_name=self.student_name,
            student_email=self.student_email,
            student_phone=self.student_phone,
            student_age=self.student_age,
            booked_at=self.booked_at,
            status=self.status
        )

    @classmethod
    def from_pydantic(cls, booking: Booking) -> "BookingORM":
        """Create ORM model from Pydantic model"""
        return cls(
            id=booking.id,
            time_slot_id=booking.time_slot_id,
            user_id=booking.user_id,
            student_name=booking.student_name,
            student_email=booking.student_email,
            student_phone=booking.student_phone,
            student_age=booking.student_age,
            booked_at=booking.booked_at,
            status=booking.status
        )
