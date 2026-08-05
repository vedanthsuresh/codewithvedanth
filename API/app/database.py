from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.exc import IntegrityError
from typing import List, Optional, Dict
from app.models import (
    ModuleORM, UnitORM, TimeSlotORM, BookingORM,
    Module, Unit, TimeSlot, Booking, BookingResponse, BookingListAdmin,
    ModuleCreate, ModuleUpdate, LearningPath
)

# Database URL - SQLite for development
# For production, use PostgreSQL: DATABASE_URL = "postgresql://user:password@localhost/dbname"
DATABASE_URL = "sqlite:///./vedanth_classes.db"

# Create engine
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {},
    echo=False  # Set to True for SQL query logging
)

# Create SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# Dependency for FastAPI routes
def get_db() -> Session:
    """FastAPI dependency to get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class Database:
    """Database operations wrapper"""

    def __init__(self):
        self._path_counter = {
            LearningPath.PYTHON: 5,
            LearningPath.WEB_DEVELOPMENT: 5,
            LearningPath.MOBILE_DEVELOPMENT: 5
        }
        self._unit_counter = {
            LearningPath.PYTHON: 1,
            LearningPath.WEB_DEVELOPMENT: 1,
            LearningPath.MOBILE_DEVELOPMENT: 1
        }

    def get_all_modules(self, db: Session) -> List[Module]:
        """Get all modules from database"""
        modules = db.query(ModuleORM).all()
        return [m.to_pydantic() for m in modules]

    def get_module_by_id(self, db: Session, module_id: str) -> Optional[Module]:
        """Get a specific module by ID"""
        module = db.query(ModuleORM).filter(ModuleORM.id == module_id).first()
        return module.to_pydantic() if module else None

    def get_modules_by_path(self, db: Session, path_id: LearningPath) -> List[Module]:
        """Get all modules for a specific learning path"""
        modules = db.query(ModuleORM).filter(ModuleORM.path_id == path_id).all()
        return [m.to_pydantic() for m in modules]

    def create_module(self, db: Session, module_data: dict, path_id: LearningPath) -> Module:
        """Create a new module in the database"""
        # Generate ID based on path
        prefix = "py" if path_id == LearningPath.PYTHON else "web" if path_id == LearningPath.WEB_DEVELOPMENT else "mob"
        counter = self._path_counter[path_id]
        module_id = f"{prefix}-{counter:03d}"
        self._path_counter[path_id] = counter + 1

        # Create ORM model
        module_orm = ModuleORM(
            id=module_id,
            **module_data
        )

        db.add(module_orm)
        db.commit()
        db.refresh(module_orm)

        return module_orm.to_pydantic()

    def update_module(self, db: Session, module_id: str, updates: dict) -> Optional[Module]:
        """Update an existing module"""
        module = db.query(ModuleORM).filter(ModuleORM.id == module_id).first()
        if not module:
            return None

        for key, value in updates.items():
            if value is not None and hasattr(module, key):
                setattr(module, key, value)

        db.commit()
        db.refresh(module)

        return module.to_pydantic()

    def delete_module(self, db: Session, module_id: str) -> bool:
        """Delete a module"""
        module = db.query(ModuleORM).filter(ModuleORM.id == module_id).first()
        if not module:
            return False

        db.delete(module)
        db.commit()
        return True

    # Unit CRUD operations
    def get_all_units(self, db: Session, path_id: Optional[LearningPath] = None) -> List[Unit]:
        """Get all units, optionally filtered by path"""
        query = db.query(UnitORM)
        if path_id:
            query = query.filter(UnitORM.path_id == path_id)
        units = query.order_by(UnitORM.order).all()
        return [u.to_pydantic() for u in units]

    def get_unit_by_id(self, db: Session, unit_id: str) -> Optional[Unit]:
        """Get a specific unit by ID"""
        unit = db.query(UnitORM).filter(UnitORM.id == unit_id).first()
        return unit.to_pydantic() if unit else None

    def create_unit(self, db: Session, unit_data: dict, path_id: LearningPath) -> Unit:
        """Create a new unit in the database"""
        # Generate ID based on path
        prefix = "py" if path_id == LearningPath.PYTHON else "web" if path_id == LearningPath.WEB_DEVELOPMENT else "mob"
        counter = self._unit_counter[path_id]
        unit_id = f"{prefix}-u{counter:03d}"
        self._unit_counter[path_id] = counter + 1

        # Create ORM model
        unit_orm = UnitORM(
            id=unit_id,
            **unit_data
        )

        db.add(unit_orm)
        db.commit()
        db.refresh(unit_orm)

        return unit_orm.to_pydantic()

    def update_unit(self, db: Session, unit_id: str, updates: dict) -> Optional[Unit]:
        """Update an existing unit"""
        unit = db.query(UnitORM).filter(UnitORM.id == unit_id).first()
        if not unit:
            return None

        for key, value in updates.items():
            if value is not None and hasattr(unit, key):
                setattr(unit, key, value)

        db.commit()
        db.refresh(unit)

        return unit.to_pydantic()

    def delete_unit(self, db: Session, unit_id: str) -> bool:
        """Delete a unit (does not delete associated modules)"""
        unit = db.query(UnitORM).filter(UnitORM.id == unit_id).first()
        if not unit:
            return False

        db.delete(unit)
        db.commit()
        return True

    # ============ TIME SLOT CRUD OPERATIONS ============

    def get_all_time_slots(self, db: Session, available_only: bool = False) -> List[TimeSlot]:
        """Get all time slots, optionally filtered by availability"""
        slots = db.query(TimeSlotORM).order_by(TimeSlotORM.date, TimeSlotORM.time).all()
        if available_only:
            # Filter by capacity
            available_slots = []
            for slot in slots:
                booking_count = db.query(BookingORM).filter(
                    BookingORM.time_slot_id == slot.id,
                    BookingORM.status == "confirmed"
                ).count()
                if booking_count < slot.capacity:
                    available_slots.append(slot)
            return [s.to_pydantic(db) for s in available_slots]
        return [s.to_pydantic(db) for s in slots]

    def get_time_slot_by_id(self, db: Session, slot_id: str) -> Optional[TimeSlot]:
        """Get a specific time slot by ID"""
        slot = db.query(TimeSlotORM).filter(TimeSlotORM.id == slot_id).first()
        return slot.to_pydantic(db) if slot else None

    def create_time_slot(self, db: Session, slot_data: dict) -> TimeSlot:
        """Create a new time slot"""
        # Generate ID
        counter = len(db.query(TimeSlotORM).all()) + 1
        slot_id = f"ts-{counter:03d}"

        # Add timestamps
        from datetime import datetime
        now = datetime.utcnow().isoformat()

        # Create ORM model
        slot_orm = TimeSlotORM(
            id=slot_id,
            created_at=now,
            updated_at=now,
            **slot_data
        )

        db.add(slot_orm)
        db.commit()
        db.refresh(slot_orm)

        return slot_orm.to_pydantic(db)

    def update_time_slot(self, db: Session, slot_id: str, updates: dict) -> Optional[TimeSlot]:
        """Update an existing time slot"""
        slot = db.query(TimeSlotORM).filter(TimeSlotORM.id == slot_id).first()
        if not slot:
            return None

        # Check if reducing capacity below confirmed bookings
        if 'capacity' in updates and updates['capacity'] is not None:
            booking_count = db.query(BookingORM).filter(
                BookingORM.time_slot_id == slot_id,
                BookingORM.status == "confirmed"
            ).count()
            if updates['capacity'] < booking_count:
                raise ValueError(f"Cannot reduce capacity below {booking_count} confirmed bookings")

        for key, value in updates.items():
            if value is not None and hasattr(slot, key):
                setattr(slot, key, value)

        # Update timestamp
        from datetime import datetime
        slot.updated_at = datetime.utcnow().isoformat()

        db.commit()
        db.refresh(slot)

        return slot.to_pydantic(db)

    def delete_time_slot(self, db: Session, slot_id: str) -> bool:
        """Delete a time slot (prevents deletion if has confirmed bookings)"""
        slot = db.query(TimeSlotORM).filter(TimeSlotORM.id == slot_id).first()
        if not slot:
            return False

        # Check if has confirmed bookings
        has_bookings = db.query(BookingORM).filter(
            BookingORM.time_slot_id == slot_id,
            BookingORM.status == "confirmed"
        ).first()
        if has_bookings:
            raise ValueError("Cannot delete time slot with confirmed bookings")

        db.delete(slot)
        db.commit()
        return True

    # ============ BOOKING CRUD OPERATIONS ============

    def get_all_bookings(self, db: Session) -> List[BookingListAdmin]:
        """Get all bookings with admin details"""
        bookings = db.query(BookingORM).order_by(BookingORM.booked_at.desc()).all()
        result = []
        for b in bookings:
            slot = db.query(TimeSlotORM).filter(TimeSlotORM.id == b.time_slot_id).first()
            booking_count = db.query(BookingORM).filter(
                BookingORM.time_slot_id == b.time_slot_id,
                BookingORM.status == "confirmed"
            ).count()

            booking_data = b.to_pydantic()
            booking_data_dict = booking_data.model_dump()
            booking_data_dict['time_slot_date'] = slot.date if slot else "N/A"
            booking_data_dict['time_slot_time'] = slot.time if slot else "N/A"
            booking_data_dict['bookings_count'] = booking_count
            result.append(BookingListAdmin(**booking_data_dict))
        return result

    def get_bookings_for_user(self, db: Session, user_id: str) -> List[Booking]:
        """Get all bookings for a specific user"""
        bookings = db.query(BookingORM).filter(
            BookingORM.user_id == user_id
        ).order_by(BookingORM.booked_at.desc()).all()
        return [b.to_pydantic() for b in bookings]

    def get_bookings_for_slot(self, db: Session, slot_id: str) -> List[Booking]:
        """Get all bookings for a specific time slot"""
        bookings = db.query(BookingORM).filter(
            BookingORM.time_slot_id == slot_id
        ).order_by(BookingORM.booked_at).all()
        return [b.to_pydantic() for b in bookings]

    def get_booking_count_for_slot(self, db: Session, slot_id: str) -> int:
        """Get count of confirmed bookings for a slot"""
        return db.query(BookingORM).filter(
            BookingORM.time_slot_id == slot_id,
            BookingORM.status == "confirmed"
        ).count()

    def create_booking(self, db: Session, booking_data: dict) -> BookingResponse:
        """Create a new booking"""
        # Check slot exists and is available
        slot = db.query(TimeSlotORM).filter(
            TimeSlotORM.id == booking_data["time_slot_id"]
        ).first()
        if not slot:
            raise ValueError("Time slot not found")

        # Count existing confirmed bookings
        booking_count = db.query(BookingORM).filter(
            BookingORM.time_slot_id == slot.id,
            BookingORM.status == "confirmed"
        ).count()

        if booking_count >= slot.capacity:
            raise ValueError("Time slot is fully booked")

        # Check for duplicate email in same slot
        existing = db.query(BookingORM).filter(
            BookingORM.time_slot_id == slot.id,
            BookingORM.student_email == booking_data["student_email"],
            BookingORM.status == "confirmed"
        ).first()
        if existing:
            raise ValueError("You have already booked this time slot")

        # Generate ID
        counter = len(db.query(BookingORM).all()) + 1
        booking_id = f"bk-{counter:03d}"

        # Add timestamp
        from datetime import datetime
        now = datetime.utcnow().isoformat()

        # Create ORM model
        booking_orm = BookingORM(
            id=booking_id,
            booked_at=now,
            status="confirmed",
            **booking_data
        )

        db.add(booking_orm)
        db.commit()
        db.refresh(booking_orm)

        # Return with nested time slot
        return BookingResponse(
            **booking_orm.to_pydantic().model_dump(),
            time_slot=slot.to_pydantic(db)
        )

    def update_booking_status(self, db: Session, booking_id: str, status: str) -> bool:
        """Update booking status"""
        booking = db.query(BookingORM).filter(BookingORM.id == booking_id).first()
        if not booking:
            return False
        booking.status = status
        db.commit()
        return True

    def delete_booking(self, db: Session, booking_id: str) -> bool:
        """Delete a booking"""
        booking = db.query(BookingORM).filter(BookingORM.id == booking_id).first()
        if not booking:
            return False
        db.delete(booking)
        db.commit()
        return True


# Create tables
def init_db():
    """Initialize database tables"""
    from app.models import Base
    Base.metadata.create_all(bind=engine)


# Initialize database on import
init_db()

# Export database instance
db = Database()
