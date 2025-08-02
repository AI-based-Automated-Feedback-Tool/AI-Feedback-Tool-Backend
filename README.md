# 🧠 AI Feedback Tool - Backend

This is the backend for the **AI-Based Automated Feedback Tool**. It powers the storage, retrieval, and management of course, exam, and feedback data via a RESTful API using **Node.js**, **Express**, and **Supabase**.

--

## 🚀 Features

- 🗃️ RESTful API to manage:
  - Courses
  - Exam types
  - Exams and student submissions
  - AI-generated feedback data
- 🧪 Integrated with Supabase (PostgreSQL)
- 🔐 Secured via Supabase Auth
- 🌐 Ready for deployment on platforms like Render

---

## 🛠️ Tech Stack

| Layer      | Technology            |
|------------|------------------------|
| Backend    | Node.js + Express      |
| Database   | Supabase (PostgreSQL)  |
| Auth       | Supabase Auth          |
| Hosting    | Render (or local)      |

---

## 🏁 Getting Started

To get the backend running locally, follow these steps:

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18+ recommended)
- [Supabase](https://supabase.com/) project (used as backend database)
- `.env` file with necessary environment variables

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env` file

Create a `.env` file in the root directory based on `.env.example`:

```
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_key
COHERE_API_KEY=your_cohere_key
OPENAI_API_KEY=your_openai_key (optional)
```

> ✅ **Note**: Never commit your `.env` file. It's already listed in `.gitignore`.

---

## ▶️ Run the Backend Server

```bash
npm run dev
```

This starts the server on `http://localhost:3000`.

---
