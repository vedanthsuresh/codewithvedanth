"""
Seed script to populate the database with initial module data.
Run this after creating the database to add sample modules.
"""
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app.models import ModuleORM, Base
import sys

# Sample modules data
SAMPLE_MODULES = [
    # Python modules
    {
        "id": "py-001",
        "path_id": "python",
        "title": "Introduction to Python",
        "description": "Learn the basics of Python programming, including variables, data types, and simple operations.",
        "duration_minutes": 45,
        "price_on_one": 10.0,
        "price_group": 8.0,
        "difficulty_level": "beginner",
        "objectives": [
            "Understand variables and how to use them",
            "Learn basic data types (strings, numbers, booleans)",
            "Write simple Python programs",
            "Use print() and input() functions"
        ],
        "prerequisites": []
    },
    {
        "id": "py-002",
        "path_id": "python",
        "title": "Python Loops and Logic",
        "description": "Master loops, conditionals, and logical thinking in Python.",
        "duration_minutes": 45,
        "price_on_one": 10.0,
        "price_group": 8.0,
        "difficulty_level": "beginner",
        "objectives": [
            "Understand if/else statements",
            "Write for and while loops",
            "Apply logical thinking to solve problems"
        ],
        "prerequisites": ["py-001"]
    },
    {
        "id": "py-003",
        "path_id": "python",
        "title": "Functions and Modular Code",
        "description": "Learn how to write reusable code using functions.",
        "duration_minutes": 45,
        "price_on_one": 10.0,
        "price_group": 8.0,
        "difficulty_level": "intermediate",
        "objectives": [
            "Define and call functions",
            "Understand parameters and return values",
            "Write modular, reusable code"
        ],
        "prerequisites": ["py-002"]
    },
    # Web Development modules
    {
        "id": "web-001",
        "path_id": "web_development",
        "title": "HTML Basics",
        "description": "Learn the building blocks of web pages with HTML.",
        "duration_minutes": 45,
        "price_on_one": 10.0,
        "price_group": 8.0,
        "difficulty_level": "beginner",
        "objectives": [
            "Understand HTML tags and structure",
            "Create headings, paragraphs, and lists",
            "Build your first web page"
        ],
        "prerequisites": []
    },
    {
        "id": "web-002",
        "path_id": "web_development",
        "title": "CSS Styling",
        "description": "Make your web pages beautiful with CSS.",
        "duration_minutes": 45,
        "price_on_one": 10.0,
        "price_group": 8.0,
        "difficulty_level": "beginner",
        "objectives": [
            "Add colors and fonts to your pages",
            "Understand the box model",
            "Style text and backgrounds"
        ],
        "prerequisites": ["web-001"]
    },
    # Mobile Development modules
    {
        "id": "mob-001",
        "path_id": "mobile_development",
        "title": "Introduction to Mobile Apps",
        "description": "Learn what mobile apps are and how they work.",
        "duration_minutes": 45,
        "price_on_one": 10.0,
        "price_group": 8.0,
        "difficulty_level": "beginner",
        "objectives": [
            "Understand mobile app concepts",
            "Explore different types of apps",
            "Learn about app stores"
        ],
        "prerequisites": []
    },
]


def seed_database():
    """Seed the database with sample modules"""
    db: Session = SessionLocal()

    try:
        # Check if database is already seeded
        existing_count = db.query(ModuleORM).count()
        if existing_count > 0:
            print(f"Database already has {existing_count} modules. Skipping seed.")
            return

        print(f"Seeding database with {len(SAMPLE_MODULES)} modules...")

        for module_data in SAMPLE_MODULES:
            module = ModuleORM(**module_data)
            db.add(module)

        db.commit()
        print(f"Successfully seeded {len(SAMPLE_MODULES)} modules!")

        # Verify
        count = db.query(ModuleORM).count()
        print(f"Total modules in database: {count}")

    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    # Create tables if they don't exist
    from app.models import Base
    Base.metadata.create_all(bind=engine)

    # Seed the database
    seed_database()
