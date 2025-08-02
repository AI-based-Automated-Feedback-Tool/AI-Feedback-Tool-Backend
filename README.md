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

## 🧪 API Endpoints Overview

| Method | Endpoint                  | Description                            |
|--------|---------------------------|----------------------------------------|
| GET    | `/api/courses`            | Fetch all available courses            |
| GET    | `/api/exams/:courseId`    | Fetch exams for a specific course      |
| POST   | `/api/feedback/mcq`       | Generate feedback for MCQ answers      |
| POST   | `/api/feedback/code`      | Generate feedback for code questions   |
| POST   | `/api/feedback/essay`     | Generate feedback for essay answers    |

> All endpoints use JSON for request and response.

---

## 🛠 AI Model Integration

By default, the backend uses the **Cohere API** to generate text-based feedback. Optionally, you can switch to **OpenAI** by modifying the logic in `services/`.

---

## 🔒 Security Notes

- The service role key from Supabase is stored in `.env` and used server-side only.
- Make sure to **never expose your `.env` content** in the frontend.

---

## 🤝 Contributing

We welcome your contributions! Follow these steps:

1. Fork this repo
2. Create your branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'Add new feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Submit a pull request

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙌 Acknowledgements

- [Supabase](https://supabase.com/)
- [Cohere](https://cohere.com/)
- [OpenAI](https://openai.com/)
- [Express.js](https://expressjs.com/)

---
