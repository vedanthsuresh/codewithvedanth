from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.exc import IntegrityError
from typing import List, Optional, Dict
from app.models import ModuleORM, UnitORM, Module, Unit, ModuleCreate, ModuleUpdate, LearningPath

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


# Create tables
def init_db():
    """Initialize database tables"""
    from app.models import Base
    Base.metadata.create_all(bind=engine)


# Initialize database on import
init_db()

# Export database instance
db = Database()
