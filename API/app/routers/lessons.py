from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.models import Lesson, LessonCreate, LessonUpdate, LearningPath, LearningPathInfo
from app.database import db

router = APIRouter(prefix="/lessons", tags=["lessons"])


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


@router.get("", response_model=List[Lesson])
async def get_lessons(
    path_id: Optional[LearningPath] = Query(default=None, description="Filter by learning path"),
    age_range: Optional[str] = Query(default=None, description="Filter by age range (e.g., '6-9', '10-12')"),
    difficulty: Optional[str] = Query(default=None, description="Filter by difficulty level")
):
    """Get all lessons with optional filtering by path, age range, and difficulty."""
    lessons = db.get_all_lessons()

    if path_id:
        lessons = [l for l in lessons if l.path_id == path_id]
    if age_range:
        lessons = [l for l in lessons if l.age_range == age_range]
    if difficulty:
        lessons = [l for l in lessons if l.difficulty_level == difficulty]

    return lessons


@router.get("/{lesson_id}", response_model=Lesson)
async def get_lesson(lesson_id: str):
    """Get a specific lesson by ID."""
    lesson = db.get_lesson_by_id(lesson_id)
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    return lesson


@router.post("", response_model=Lesson, status_code=201)
async def create_lesson(lesson: LessonCreate):
    """Create a new lesson."""
    lesson_data = lesson.model_dump()
    new_lesson = db.create_lesson(lesson_data, lesson.path_id)
    return new_lesson


@router.put("/{lesson_id}", response_model=Lesson)
async def update_lesson(lesson_id: str, updates: LessonUpdate):
    """Update an existing lesson."""
    update_data = updates.model_dump(exclude_unset=True)
    if not update_data:
        return db.get_lesson_by_id(lesson_id)

    updated_lesson = db.update_lesson(lesson_id, update_data)
    if not updated_lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    return updated_lesson


@router.delete("/{lesson_id}", status_code=204)
async def delete_lesson(lesson_id: str):
    """Delete a lesson."""
    if not db.delete_lesson(lesson_id):
        raise HTTPException(status_code=404, detail="Lesson not found")
    return None
