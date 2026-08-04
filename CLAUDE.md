# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **programming lessons website and student portal** built with React + Vite (React 19) for **Vedanth Suresh's coding classes**. It serves two primary purposes:

1. **Marketing**: Advertise programming lessons to prospective students (ages 6-12)
2. **Portal**: Enable enrolled students to access lessons, complete assignments, and track progress

### Business Details

**Instructor: Vedanth Suresh**
- 1st place in mobile app and web design state-wide
- Regional winner in computer science competitions
- Top 10 in web design nationally
- Built 30+ apps, websites, and AI models
- 300+ hours of practical coding experience

**Classes Offered:**
- **Age Range**: 6-12 years old
- **Price**: $10 for 1-on-1 lessons; $8 for group lessons
- **Format**: Online lessons, small group sizes
- **Duration**: 45 minutes per session
- **Free Trial**: First class is free

**Three Learning Paths:**
1. **Python** - Programming fundamentals and projects
2. **Web Development** - Building websites and web apps
3. **Mobile Development** - Creating mobile applications

**Value Proposition ("Why Learn to Code?"):**
- Enhances critical thinking skills
- Teaches perseverance and resilience
- Fosters an in-demand skill for the future
- Ability to automate repetitive tasks
- Build real apps and websites

**Contact Information:**
- Email: vedanth.suresh039@gmail.com
- Phone: 943-238-1652

### Planned Pages/Sections

**1. Landing Page (`/`)**
- Hero: "UNLOCK YOUR TECH SUPERPOWERS" with value proposition
- "Why Learn to Code?" section with 5 key benefits
- Instructor credentials (Vedanth Suresh's achievements)
- Three learning paths showcase (Python, Web Dev, Mobile Dev)
- Age range: 6-12, pricing ($10 1-on-1, $8 group)
- **Prominent CTA**: "Claim Your Free Trial Class"
- Contact info (email, phone)
- Navigation to other pages

**2. Lessons/Courses Page (`/lessons`)**
- Catalog of lessons across three paths (Python, Web Dev, Mobile Dev)
- Filtering by learning path, age appropriateness, difficulty
- Lesson cards with: title, description, age range, duration (45 mins), price
- Search functionality
- "Book Free Trial" callout on cards

**3. Individual Lesson Page (`/lesson/:id`)**
- Learning path indicator (Python/Web/Mobile)
- Lesson content (text, code examples, video embeds)
- Prerequisites and learning objectives
- Related assignments link
- Navigation (next/previous lesson in path)
- Progress indicator for enrolled students

**4. Assignments Portal (`/assignments`)**
- List of assignments for enrolled students
- Status indicators (not started, in progress, submitted, graded)
- Due dates and submission links
- Filter by learning path or lesson

**5. Assignment Detail/Submission (`/assignment/:id`)**
- Assignment description and requirements
- Code editor or file upload area for submissions
- Submission history
- Instructor feedback (when graded)

**6. Student Dashboard (`/dashboard`)**
- Progress overview (lessons completed, in progress by learning path)
- Recent activity and upcoming assignments
- Quick links to current lessons and pending assignments
- Progress visualizations by path (Python/Web/Mobile)

**7. Authentication Pages**
- Login page (`/login`) — for enrolled students
- Registration/sign-up page (`/register`) — with free trial option
- Password reset (if needed)

**8. About/Contact Page (`/about`)**
- Detailed instructor bio and credentials (competition wins, projects built)
- Teaching philosophy and approach
- Contact form (email: vedanth.suresh039@gmail.com, phone: 943-238-1652)
- FAQ section (pricing, age requirements, format, etc.)

## Development Commands

- `npm run dev` — Start development server with HMR
- `npm run build` — Build for production (outputs to `dist/`)
- `npm run lint` — Run oxlint (configured in `.oxlintrc.json`)
- `npm run preview` — Preview production build locally

## Architecture

**Entry Points:**
- `index.html` — HTML template, mounts `<div id="root">`
- `src/main.jsx` — React entry, renders `<App />` into root using `StrictMode`

**Source Structure:**
- `src/App.jsx` — Main application component
- `src/App.css` — Component-specific styles
- `src/index.css` — Global styles
- `src/assets/` — Static assets (images, etc.)

**Linting:**
Uses [oxlint](https://oxc.rs/) (not ESLint), configured in `.oxlintrc.json`. Current rules enforce React hooks usage and component export patterns.

**Build Tool:**
Vite with `@vitejs/plugin-react` (uses Oxc transformer). Config is minimal — see `vite.config.js`.

## Routing & Architecture Considerations

**Client-Side Routing:**
This app will require multiple pages/routes. Install a router (React Router recommended):
```bash
npm install react-router-dom
```

**Suggested Component Structure:**
```
src/
├── components/
│   ├── common/           # Reusable components (Button, Card, Modal)
│   ├── layout/           # Layout components (Navbar, Footer, Sidebar)
│   └── features/         # Feature-specific components
├── pages/                # Route components
│   ├── Landing.jsx
│   ├── Lessons.jsx
│   ├── LessonDetail.jsx
│   ├── Assignments.jsx
│   ├── AssignmentDetail.jsx
│   ├── Dashboard.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   └── About.jsx
├── hooks/                # Custom React hooks
├── utils/                # Helper functions
└── data/                 # Mock data (eventually replace with API)
```

**Data Management:**
- Start with local state (useState, useContext)
- Consider state management (Zustand, Jotai, or Context) as app grows
- Plan for future API integration (lessons, assignments, user data)

**Key Data Models (for mock data structure):**
- `LearningPath`: { id, name, description, icon } — Python, Web Development, Mobile Development
- `Lesson`: { id, pathId, title, description, ageRange, duration: "45 mins", price, content }
- `Assignment`: { id, lessonId, title, description, dueDate, submissions }
- `Student`: { id, name, age, parentEmail, enrollments[], progress }
- `Enrollment`: { studentId, lessonId, status, progress, completedAt }
- `Submission`: { id, assignmentId, studentId, code, status, feedback }

**Styling Approach:**
- CSS Modules or Tailwind CSS recommended for scalability
- Maintain consistent design system across pages
- Consider responsive design from the start (mobile-first)
