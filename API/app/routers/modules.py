from fastapi import APIRouter, HTTPException, Query, Depends
from typing import List, Optional
from sqlalchemy.orm import Session

from app.models import Module, ModuleCreate, ModuleUpdate, LearningPath, LearningPathInfo
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
