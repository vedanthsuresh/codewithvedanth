from typing import List, Dict, Optional
from app.models import Lesson, LearningPath


# Mock lessons data (3-5 lessons per path)
MOCK_LESSONS: List[Dict] = [
    # Python lessons
    {
        "id": "py-001",
        "path_id": LearningPath.PYTHON,
        "title": "Introduction to Python",
        "description": "Learn the basics of Python programming, including variables, data types, and simple operations.",
        "age_range": "6-9",
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
        "path_id": LearningPath.PYTHON,
        "title": "Python Loops and Logic",
        "description": "Master loops, conditionals, and logical thinking in Python.",
        "age_range": "6-9",
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
        "path_id": LearningPath.PYTHON,
        "title": "Functions and Modular Code",
        "description": "Learn how to write reusable code using functions.",
        "age_range": "8-12",
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
    {
        "id": "py-004",
        "path_id": LearningPath.PYTHON,
        "title": "Python Projects: Build a Game",
        "description": "Apply your Python skills to build a fun interactive game.",
        "age_range": "8-12",
        "duration_minutes": 45,
        "price_on_one": 10.0,
        "price_group": 8.0,
        "difficulty_level": "intermediate",
        "objectives": [
            "Design a simple game",
            "Combine loops, conditionals, and functions",
            "Add user interaction and scoring"
        ],
        "prerequisites": ["py-003"]
    },
    # Web Development lessons
    {
        "id": "web-001",
        "path_id": LearningPath.WEB_DEVELOPMENT,
        "title": "HTML Basics",
        "description": "Learn the building blocks of web pages with HTML.",
        "age_range": "6-9",
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
        "path_id": LearningPath.WEB_DEVELOPMENT,
        "title": "CSS Styling",
        "description": "Make your web pages beautiful with CSS.",
        "age_range": "6-9",
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
    {
        "id": "web-003",
        "path_id": LearningPath.WEB_DEVELOPMENT,
        "title": "Responsive Web Design",
        "description": "Build websites that look great on any device.",
        "age_range": "8-12",
        "duration_minutes": 45,
        "price_on_one": 10.0,
        "price_group": 8.0,
        "difficulty_level": "intermediate",
        "objectives": [
            "Understand responsive design principles",
            "Use flexbox for layouts",
            "Make pages mobile-friendly"
        ],
        "prerequisites": ["web-002"]
    },
    {
        "id": "web-004",
        "path_id": LearningPath.WEB_DEVELOPMENT,
        "title": "JavaScript Fundamentals",
        "description": "Add interactivity to your websites with JavaScript.",
        "age_range": "10-12",
        "duration_minutes": 45,
        "price_on_one": 10.0,
        "price_group": 8.0,
        "difficulty_level": "intermediate",
        "objectives": [
            "Write JavaScript code",
            "Handle user events",
            "Manipulate the DOM"
        ],
        "prerequisites": ["web-003"]
    },
    # Mobile Development lessons
    {
        "id": "mob-001",
        "path_id": LearningPath.MOBILE_DEVELOPMENT,
        "title": "Introduction to Mobile Apps",
        "description": "Learn what mobile apps are and how they work.",
        "age_range": "6-9",
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
    {
        "id": "mob-002",
        "path_id": LearningPath.MOBILE_DEVELOPMENT,
        "title": "App Design Basics",
        "description": "Learn how to design user-friendly mobile interfaces.",
        "age_range": "8-12",
        "duration_minutes": 45,
        "price_on_one": 10.0,
        "price_group": 8.0,
        "difficulty_level": "beginner",
        "objectives": [
            "Design app screens and layouts",
            "Understand user experience principles",
            "Create button and navigation designs"
        ],
        "prerequisites": []
    },
    {
        "id": "mob-003",
        "path_id": LearningPath.MOBILE_DEVELOPMENT,
        "title": "Build Your First App",
        "description": "Create a simple, functional mobile application.",
        "age_range": "10-12",
        "duration_minutes": 45,
        "price_on_one": 10.0,
        "price_group": 8.0,
        "difficulty_level": "intermediate",
        "objectives": [
            "Use a mobile development framework",
            "Build a working app prototype",
            "Test your app on a device or simulator"
        ],
        "prerequisites": ["mob-002"]
    },
    {
        "id": "mob-004",
        "path_id": LearningPath.MOBILE_DEVELOPMENT,
        "title": "App Publishing",
        "description": "Learn how to prepare and publish your app to app stores.",
        "age_range": "10-12",
        "duration_minutes": 45,
        "price_on_one": 10.0,
        "price_group": 8.0,
        "difficulty_level": "advanced",
        "objectives": [
            "Prepare your app for release",
            "Understand app store guidelines",
            "Learn about app updates and maintenance"
        ],
        "prerequisites": ["mob-003"]
    }
]


class Database:
    def __init__(self):
        self.lessons: Dict[str, Lesson] = {
            lesson["id"]: Lesson(**lesson) for lesson in MOCK_LESSONS
        }
        self._path_counter = {
            LearningPath.PYTHON: 5,
            LearningPath.WEB_DEVELOPMENT: 5,
            LearningPath.MOBILE_DEVELOPMENT: 5
        }

    def get_all_lessons(self) -> List[Lesson]:
        return list(self.lessons.values())

    def get_lesson_by_id(self, lesson_id: str) -> Optional[Lesson]:
        return self.lessons.get(lesson_id)

    def get_lessons_by_path(self, path_id: LearningPath) -> List[Lesson]:
        return [l for l in self.lessons.values() if l.path_id == path_id]

    def create_lesson(self, lesson_data: dict, path_id: LearningPath) -> Lesson:
        # Generate ID based on path
        prefix = "py" if path_id == LearningPath.PYTHON else "web" if path_id == LearningPath.WEB_DEVELOPMENT else "mob"
        counter = self._path_counter[path_id]
        lesson_id = f"{prefix}-{counter:03d}"
        self._path_counter[path_id] = counter + 1

        lesson = Lesson(id=lesson_id, **lesson_data)
        self.lessons[lesson_id] = lesson
        return lesson

    def update_lesson(self, lesson_id: str, updates: dict) -> Optional[Lesson]:
        if lesson_id not in self.lessons:
            return None
        lesson = self.lessons[lesson_id]
        for key, value in updates.items():
            if value is not None and hasattr(lesson, key):
                setattr(lesson, key, value)
        return lesson

    def delete_lesson(self, lesson_id: str) -> bool:
        if lesson_id in self.lessons:
            del self.lessons[lesson_id]
            return True
        return False


db = Database()
