from fastapi import APIRouter, HTTPException, Query, Depends
from typing import List, Optional
from sqlalchemy.orm import Session

from app.models import Module, Unit, ModuleCreate, ModuleUpdate, UnitCreate, UnitUpdate, LearningPath, LearningPathInfo
from app.database import get_db, db as database

router = APIRouter(prefix="/modules", tags=["modules"])


@router.get("/paths", response_model=List[LearningPathInfo])
async def get_learning_paths():
    """Get information about all available learning paths."""
    return [
        {
            "id": LearningPath.PYTHON,
            "name": "Python Programming",
            "description": "Learn programming fundamentals and build projects with Python",
            "icon": "🐍",
            "color": "#3776ab"
        },
        {
            "id": LearningPath.WEB_DEVELOPMENT,
            "name": "Web Development",
            "description": "Build websites and web applications using HTML, CSS, and JavaScript",
            "icon": "🌐",
            "color": "#1572b6"
        },
        {
            "id": LearningPath.MOBILE_DEVELOPMENT,
            "name": "Mobile Development",
            "description": "Create mobile applications for iOS and Android",
            "icon": "📱",
            "color": "#6c757d"
        }
    ]


@router.get("", response_model=List[Module])
async def get_modules(
    path_id: Optional[LearningPath] = Query(default=None, description="Filter by learning path"),
    difficulty: Optional[str] = Query(default=None, description="Filter by difficulty level"),
    db: Session = Depends(get_db)
):
    """Get all modules with optional filtering by path and difficulty."""
    modules = database.get_all_modules(db)

    if path_id:
        modules = [m for m in modules if m.path_id == path_id]
    if difficulty:
        modules = [m for m in modules if m.difficulty_level == difficulty]

    return modules


# Unit endpoints (must come before /{module_id} to avoid route conflicts)
@router.get("/units", response_model=List[Unit])
async def get_units(
    path_id: Optional[LearningPath] = Query(default=None, description="Filter by learning path"),
    db: Session = Depends(get_db)
):
    """Get all units with optional filtering by path."""
    return database.get_all_units(db, path_id)


@router.get("/units/{unit_id}", response_model=Unit)
async def get_unit(unit_id: str, db: Session = Depends(get_db)):
    """Get a specific unit by ID."""
    unit = database.get_unit_by_id(db, unit_id)
    if not unit:
        raise HTTPException(status_code=404, detail="Unit not found")
    return unit


@router.post("/units", response_model=Unit, status_code=201)
async def create_unit(unit: UnitCreate, db: Session = Depends(get_db)):
    """Create a new unit."""
    unit_data = unit.model_dump()
    return database.create_unit(db, unit_data, unit.path_id)


@router.put("/units/{unit_id}", response_model=Unit)
async def update_unit(unit_id: str, updates: UnitUpdate, db: Session = Depends(get_db)):
    """Update an existing unit."""
    update_data = updates.model_dump(exclude_unset=True)
    if not update_data:
        return database.get_unit_by_id(db, unit_id)

    updated_unit = database.update_unit(db, unit_id, update_data)
    if not updated_unit:
        raise HTTPException(status_code=404, detail="Unit not found")
    return updated_unit


@router.delete("/units/{unit_id}", status_code=204)
async def delete_unit(unit_id: str, db: Session = Depends(get_db)):
    """Delete a unit (does not delete associated modules)."""
    if not database.delete_unit(db, unit_id):
        raise HTTPException(status_code=404, detail="Unit not found")
    return None


@router.get("/units/{unit_id}/modules", response_model=List[Module])
async def get_unit_modules(unit_id: str, db: Session = Depends(get_db)):
    """Get all modules for a specific unit."""
    from app.models import ModuleORM
    modules = db.query(ModuleORM).filter(ModuleORM.unit_id == unit_id).order_by(ModuleORM.order).all()
    return [m.to_pydantic() for m in modules]


@router.get("/{module_id}", response_model=Module)
async def get_module(module_id: str, db: Session = Depends(get_db)):
    """Get a specific module by ID."""
    module = database.get_module_by_id(db, module_id)
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")
    return module


@router.post("", response_model=Module, status_code=201)
async def create_module(module: ModuleCreate, db: Session = Depends(get_db)):
    """Create a new module."""
    module_data = module.model_dump()
    new_module = database.create_module(db, module_data, module.path_id)
    return new_module


@router.put("/{module_id}", response_model=Module)
async def update_module(module_id: str, updates: ModuleUpdate, db: Session = Depends(get_db)):
    """Update an existing module."""
    update_data = updates.model_dump(exclude_unset=True)
    if not update_data:
        return database.get_module_by_id(db, module_id)

    updated_module = database.update_module(db, module_id, update_data)
    if not updated_module:
        raise HTTPException(status_code=404, detail="Module not found")
    return updated_module


@router.delete("/{module_id}", status_code=204)
async def delete_module(module_id: str, db: Session = Depends(get_db)):
    """Delete a module."""
    if not database.delete_module(db, module_id):
        raise HTTPException(status_code=404, detail="Module not found")
    return None


@router.get("/units/{unit_id}", response_model=Unit)
async def get_unit(unit_id: str, db: Session = Depends(get_db)):
    """Get a specific unit by ID."""
    unit = database.get_unit_by_id(db, unit_id)
    if not unit:
        raise HTTPException(status_code=404, detail="Unit not found")
    return unit


@router.post("/units", response_model=Unit, status_code=201)
async def create_unit(unit: UnitCreate, db: Session = Depends(get_db)):
    """Create a new unit."""
    unit_data = unit.model_dump()
    return database.create_unit(db, unit_data, unit.path_id)


@router.put("/units/{unit_id}", response_model=Unit)
async def update_unit(unit_id: str, updates: UnitUpdate, db: Session = Depends(get_db)):
    """Update an existing unit."""
    update_data = updates.model_dump(exclude_unset=True)
    if not update_data:
        return database.get_unit_by_id(db, unit_id)

    updated_unit = database.update_unit(db, unit_id, update_data)
    if not updated_unit:
        raise HTTPException(status_code=404, detail="Unit not found")
    return updated_unit


@router.delete("/units/{unit_id}", status_code=204)
async def delete_unit(unit_id: str, db: Session = Depends(get_db)):
    """Delete a unit (does not delete associated modules)."""
    if not database.delete_unit(db, unit_id):
        raise HTTPException(status_code=404, detail="Unit not found")
    return None


@router.get("/units/{unit_id}/modules", response_model=List[Module])
async def get_unit_modules(unit_id: str, db: Session = Depends(get_db)):
    """Get all modules for a specific unit."""
    from app.models import ModuleORM
    modules = db.query(ModuleORM).filter(ModuleORM.unit_id == unit_id).order_by(ModuleORM.order).all()
    return [m.to_pydantic() for m in modules]
