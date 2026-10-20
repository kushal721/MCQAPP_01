# MCQPrep

A full-stack multiple-choice question (MCQ) practice app for entrance and competitive exams such as IOE, IOM, KU and Loksewa. Students pick a course and a subject, then answer random questions they haven't seen before, with instant feedback and an explanation for each answer. Admins manage the question bank from a built-in dashboard.

**Stack:** React 18 + Vite 5 · React Router 6 · Tailwind CSS 3 · Node.js · Express 4 · MongoDB (Mongoose 8)

---

## Features

### For students
- **Course → subject → quiz flow** with a clean, responsive UI that works on desktop and mobile
- **No repeats:** each question is drawn at random from the ones you haven't answered in that subject yet
- **Instant feedback:** the correct answer and its explanation appear as soon as you pick an option
- **Progress tracking:** progress bars per subject, plus answered count and accuracy for each course
- **Session stats:** score for the current session and a streak counter
- **Practise again:** reset a subject to start it over
- **Keyboard shortcuts:** press `A`–`F` or `1`–`6` to answer and `Enter` / `→` for the next question

### For admins (`/admin`)
- **Login required:** email and password sign-in, with sessions that expire and access checked on every request
- Dashboard with totals for courses, subjects, questions and answers given
- Create, edit and delete **courses** and **subjects**. Deleting one also deletes everything under it.
- Browse and search the **questions** in a subject, with the correct answers highlighted
- Question editor with 2–6 options, one-click correct-answer marking, an optional explanation, and **Save & add another** for entering questions in bulk

### Under the hood
- Admin passwords are hashed with bcrypt. Sessions are signed JWTs, and the server checks them on every admin request. Login responses don't reveal which emails have accounts, and repeated failed logins are rate-limited.
- The client never receives answers before the student commits. The server checks the chosen option and only then reveals the correct one and the explanation.
- Validation on every write endpoint, consistent JSON errors, and a 404 handler for unknown routes
- A seed script with sample IOE, IOM and Loksewa questions

---

## Project structure

```
MCQAPP_01/
├── backend/
│   ├── controllers/      # auth, course, subject, question, stats logic
│   ├── middleware/       # requireAdmin (JWT check)
│   ├── models/           # Mongoose schemas (Admin, Course, Subject, Question, QuestionAttempt, User)
│   ├── routes/           # Express routers mounted under /api
│   ├── seed.js           # sample data loader
│   ├── createAdmin.js    # create an admin / reset a password
│   └── index.js          # app entry point
└── frontend/
    ├── index.html        # Vite entry HTML
    ├── vite.config.js
    └── src/
        ├── main.jsx      # React entry point
        ├── api.js        # all HTTP calls in one place
        ├── components/   # layout + reusable UI (modal, toast, progress bar…)
        ├── lib/          # hooks and helpers
        └── pages/        # Home, CoursePage, QuizPage, NotFound, Admin/*
```

---

## Getting started

### Prerequisites
- Node.js 18 or newer
- MongoDB running locally, or a MongoDB Atlas connection string

### 1. Clone

```bash
git clone https://github.com/kushal721/MCQAPP_01.git
cd MCQAPP_01
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env      # then edit DATABASE_URL if needed
npm run seed              # optional: load sample courses & questions
npm run create-admin      # create your admin login (asks for email, name, password)
npm run dev               # starts the API on http://localhost:4000 with auto-reload
```

| Variable       | Default                          | Description                      |
| -------------- | -------------------------------- | -------------------------------- |
| `DATABASE_URL` | `mongodb://127.0.0.1:27017/MCQ`  | MongoDB connection string        |
| `PORT`         | `4000`                           | Port the API listens on          |
| `CORS_ORIGIN`  | `*`                              | Allowed frontend origin          |
| `JWT_SECRET`   | random per run in development    | Signs admin sessions. **Required in production.** Without it, development sessions end on every restart. |
| `JWT_EXPIRES_IN` | `12h`                          | How long an admin stays signed in |

`npm run seed` only seeds an empty database. To wipe everything and reseed, run `npm run seed -- --fresh`.

#### Admin accounts

There's no public sign-up. Admins are created from the command line, and the password is always typed at a prompt so it never lands in your shell history:

```bash
npm run create-admin                                        # prompts for everything
npm run create-admin -- --email you@example.com --name "You"
npm run create-admin -- --email you@example.com --reset     # change a password
```

Passwords must be at least 8 characters.

### 3. Frontend

In a second terminal:

```bash
cd frontend
npm install
cp .env.example .env      # optional, only needed if the API isn't on localhost:4000
npm run dev               # Vite dev server on http://localhost:5173
```

| Variable            | Default                      | Description               |
| ------------------- | ---------------------------- | ------------------------- |
| `VITE_API_URL`      | `http://localhost:4000/api`  | Base URL of the backend   |

Open **http://localhost:5173** to practise, or **http://localhost:5173/admin** to sign in and manage content.

### Production build

```bash
cd frontend && npm run build     # static files in frontend/dist
cd frontend && npm run preview   # serve the built files locally
cd backend && npm start          # runs the API with node
```

---

## API reference

All routes are prefixed with `/api`. Routes marked 🔒 need an admin token in an `Authorization: Bearer <token>` header and return `401` without one.

### Auth
| Method | Route          | Description |
| ------ | -------------- | ----------- |
| POST   | `/auth/login`  | `{ email, password }` → `{ token, admin }`. Returns 401 on bad credentials and 429 after 10 failures in 15 minutes. |
| GET    | `/auth/me` 🔒  | The signed-in admin |

### Courses
| Method | Route                        | Description                                   |
| ------ | ---------------------------- | --------------------------------------------- |
| GET    | `/course/getAllCourse`       | List courses with `subjectCount` and `questionCount` |
| GET    | `/course/getCourse/:id`      | Get one course                                |
| POST   | `/course/addCourse` 🔒       | Create `{ name, courseDescription }`          |
| PUT    | `/course/updateCourse/:id` 🔒 | Update name and/or description                |
| DELETE | `/course/deleteCourse/:id` 🔒 | Delete a course with its subjects, questions and attempts |

### Subjects
| Method | Route                                  | Description                               |
| ------ | -------------------------------------- | ----------------------------------------- |
| GET    | `/subject/getSubjectByCourse/:courseId`| List a course's subjects with `questionCount` |
| GET    | `/subject/getSubject/:id`              | Get one subject (course populated)        |
| POST   | `/subject/addSubject` 🔒               | Create `{ name, courseId }`               |
| PUT    | `/subject/updateSubject/:id` 🔒        | Rename `{ name }`                         |
| DELETE | `/subject/deleteSubject/:id` 🔒        | Delete a subject with its questions and attempts |

### Questions
| Method | Route                                              | Description |
| ------ | -------------------------------------------------- | ----------- |
| GET    | `/question/getQuestionsBySubject/:subject_id` 🔒   | All questions in a subject, with answers |
| GET    | `/question/getQuestion/:id` 🔒                     | One question, with answers |
| POST   | `/question/addQuestion` 🔒                         | Create `{ subject_id, question_text, options: [{ option_text, is_correct }], explanation? }` |
| PUT    | `/question/updateQuestion/:id` 🔒                  | Update any of the fields above |
| DELETE | `/question/deleteQuestion/:id` 🔒                  | Delete a question |
| GET    | `/question/getQuestionBySubject/:subject_id?userId=` | A random unanswered question, **without** the answer. Returns 404 when the subject is finished. |
| POST   | `/question/attemptedQuestion`                      | Submit `{ userId, courseId, subjectId, questionId, selectedOptionId }`. Returns `{ isCorrect, correctOptionIds, explanation }`. |
| GET    | `/question/progress/:courseId?userId=`             | `{ [subjectId]: { attempted, correct } }` |
| DELETE | `/question/resetProgress/:subject_id?userId=`      | Clear a user's answers for a subject |

### Misc
| Method | Route      | Description                |
| ------ | ---------- | -------------------------- |
| GET    | `/stats` 🔒 | Totals for the dashboard  |
| GET    | `/health`  | Health check               |

---

## How progress is tracked

Students don't need accounts. On first visit, each browser gets a random 24-character ID, stored in `localStorage`, and all answers are recorded against it. Progress therefore follows the browser, not the person. Clearing site data starts fresh.

## Known limitations / roadmap

- The admin session token is kept in `localStorage`. That's simple, but a cross-site-scripting bug could read it. For a public deployment, consider moving it to an `httpOnly` cookie and serving the site over HTTPS.
- The login rate limit is kept in memory, so it resets when the server restarts and isn't shared between multiple server instances.
- Student accounts and a leaderboard
- Timed mock tests mixing questions across subjects
- Bulk question import (CSV / JSON)

## License

ISC
