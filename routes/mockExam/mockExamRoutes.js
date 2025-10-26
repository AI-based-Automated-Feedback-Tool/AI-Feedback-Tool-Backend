// routes/mockExam/mockExamRoutes.js
// All logic (routes + generation + grading) in one file — 100% AI-driven

const express = require("express");
const router = express.Router();

const { supabase } = require("../../supabaseClient"); // Supabase SERVICE ROLE client
const OpenAI = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/* --------------------------------------------------------------------
   🔹 HELPER FUNCTIONS
-------------------------------------------------------------------- */

// Fetch all registered courses for a student
async function getRegisteredCourses(studentId) {
  const { data: sc, error: scErr } = await supabase
    .from("student_courses")
    .select("course_id")
    .eq("student_id", studentId);

  if (scErr) throw new Error(`student_courses query failed: ${scErr.message}`);

  const ids = (sc || []).map((r) => r.course_id).filter(Boolean);
  if (ids.length === 0) return [];

  const { data: courses, error: cErr } = await supabase
    .from("courses")
    .select("course_id, title")
    .in("course_id", ids);

  if (cErr) throw new Error(`courses query failed: ${cErr.message}`);

  return (courses || []).map((c) => ({
    id: c.course_id,
    title: c.title || "Untitled Course",
  }));
}

// Fetch essay-eligible courses (those with essay exams)
async function getEssayEligibleCourses(studentId) {
  const registered = await getRegisteredCourses(studentId);
  if (registered.length === 0) return [];

  const eligible = [];
  for (const c of registered) {
    const { data: exams, error: exErr } = await supabase
      .from("exams")
      .select("exam_id")
      .eq("course_id", c.id)
      .limit(20);

    if (exErr || !exams?.length) continue;

    let hasEssay = false;
    for (const ex of exams) {
      const { count, error: qErr } = await supabase
        .from("essay_questions")
        .select("question_id", { count: "exact", head: true })
        .eq("exam_id", ex.exam_id);

      if (!qErr && (count || 0) > 0) {
        hasEssay = true;
        break;
      }
    }
    if (hasEssay) eligible.push(c);
  }

  const map = new Map();
  eligible.forEach((x) => map.set(x.id, x));
  return [...map.values()];
}

/* --------------------------------------------------------------------
   🔹 AI QUESTION GENERATORS (MCQ / ESSAY / CODE)
-------------------------------------------------------------------- */

// 1️⃣ AI-generated MCQs
async function generateMcqQuestions(courseTitle) {
  const prompt = `
Generate 25 multiple-choice questions (MCQs) for the course "${courseTitle}".
Each question must have 4 options and the correct answer.
Return ONLY valid JSON, no markdown:

[
  {"id":1,"question":"...","options":["A","B","C","D"],"answer":"B"}
]
`;

  const resp = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  let text = resp.choices?.[0]?.message?.content || "[]";
  try {
    return JSON.parse(text);
  } catch {
    text = text.replace(/```json/gi, "").replace(/```/g, "").trim();
    const arr = JSON.parse(text);
    return Array.isArray(arr) ? arr : [];
  }
}

// 2️⃣ AI-generated Essay Questions
async function generateEssayQuestions(courseTitle, count = 5) {
  const prompt = `
Generate ${count} open-ended, essay-style exam questions for the course "${courseTitle}".
Each should test understanding and explanation.
Include a concise "ideal_answer" and a list of 3–5 important "keywords" to check.
Return ONLY valid JSON (no markdown):

[
  {"id":1,"question":"...","ideal_answer":"...", "keywords":["...","...","..."]}
]
`;

  const resp = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.8,
  });

  let text = resp.choices?.[0]?.message?.content || "[]";
  try {
    return JSON.parse(text);
  } catch {
    text = text.replace(/```json/gi, "").replace(/```/g, "").trim();
    const arr = JSON.parse(text);
    return Array.isArray(arr) ? arr : [];
  }
}

// 3️⃣ AI-generated Coding Questions
async function generateCodeQuestions(courseTitle, count = 5) {
  const prompt = `
Generate ${count} coding or programming exam questions for the course "${courseTitle}".
Each question must include:
- A short "problem" description
- A "difficulty" level (easy, medium, or hard)
- A model "solution" as plain text (no markdown fences)
Return valid JSON in this format:

[
  {"id":1,"question":"...","difficulty":"easy|medium|hard","solution":"..."}
]
`;

  const resp = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  let text = resp.choices?.[0]?.message?.content || "[]";
  try {
    return JSON.parse(text);
  } catch {
    text = text.replace(/```json/gi, "").replace(/```/g, "").trim();
    const arr = JSON.parse(text);
    return Array.isArray(arr) ? arr : [];
  }
}

/* --------------------------------------------------------------------
   🔹 ROUTES
-------------------------------------------------------------------- */

// Registered courses
router.get("/courses/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;
    if (!studentId)
      return res.status(400).json({ message: "studentId is required" });

    const courses = await getRegisteredCourses(studentId);
    return res.json({ courses });
  } catch (err) {
    console.error("GET /courses error:", err);
    return res
      .status(500)
      .json({ message: err?.message || "Failed to fetch courses" });
  }
});

// Essay-eligible courses
router.get("/essays/eligible-courses/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId)
      return res.status(400).json({ message: "userId is required" });

    const courses = await getEssayEligibleCourses(userId);
    return res.json({ courses });
  } catch (err) {
    console.error("GET /essays/eligible-courses error:", err);
    return res
      .status(500)
      .json({ message: err?.message || "Failed to fetch essay-eligible courses" });
  }
});

// Generate AI exam questions (MCQ, Essay, or Code)
router.post("/generate", async (req, res) => {
  try {
    const {
      questionType = "mcq",
      courseId,
      courseTitle,
      count = 5,
    } = req.body || {};

    if (!courseTitle && !courseId) {
      return res.status(400).json({ message: "courseTitle or courseId is required" });
    }

    const title = courseTitle || String(courseId);
    let questions = [];

    console.log(`🧠 Generating ${questionType} questions for "${title}"`);

    if (questionType === "essay") {
      questions = await generateEssayQuestions(title, count);
    } else if (questionType === "mcq") {
      questions = await generateMcqQuestions(title);
    } else if (questionType === "code") {
      questions = await generateCodeQuestions(title, count);
    } else {
      return res
        .status(400)
        .json({ message: "Unsupported questionType. Use 'mcq', 'essay', or 'code'." });
    }

    return res.json({ questions });
  } catch (err) {
    console.error("POST /generate error:", err);
    return res
      .status(500)
      .json({ message: err?.message || "Failed to generate questions" });
  }
});

// Essay AI grading (feedback)
router.post("/essays/grade", async (req, res) => {
  try {
    const {
      courseTitle = "the course",
      questions = [],
      answers = {},
    } = req.body || {};

    const items = questions.map((q) => ({
      id: q.id,
      prompt: q.question,
      user_answer: answers[q.id] || "",
      ideal_answer: q.ideal_answer || "",
      keywords: q.keywords || [],
    }));

    const systemPrompt = `
You are an expert examiner for ${courseTitle}.
Evaluate each student's short essay answer and give supportive feedback.
Return STRICT JSON ONLY:
{
 "graded":[
   {"id":"...","score":0..1,"verdict":"correct"|"partial"|"incorrect","feedback":"2–4 sentences","ideal_answer":"...","matched_keywords":["..."]}
 ]
}
`;

    const resp = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.3,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: JSON.stringify({ items }) },
      ],
    });

    let text = resp.choices?.[0]?.message?.content || '{"graded":[]}';
    text = text.replace(/```json/gi, "").replace(/```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      if (text.startsWith("[") && text.endsWith("]")) parsed = { graded: JSON.parse(text) };
      else throw new Error("AI returned non-JSON");
    }

    const graded = Array.isArray(parsed?.graded)
      ? parsed.graded
      : Array.isArray(parsed)
      ? parsed
      : [];

    return res.json({ graded });
  } catch (err) {
    console.error("POST /essays/grade error:", err);
    return res.status(500).json({ message: "Failed to grade essays" });
  }
});

// --------------------------------------------------------------------
// 🔹 Coding Exam AI Grading
// --------------------------------------------------------------------
router.post("/code/grade", async (req, res) => {
  try {
    const { courseTitle = "coding exam", questions = [], answers = {} } = req.body || {};

    const items = questions.map((q) => ({
      id: q.id,
      prompt: q.question || "",
      user_answer: answers[q.id] || "",
      ideal_solution: q.solution || "",
      difficulty: q.difficulty || "medium",
    }));

    const systemPrompt = `
You are an expert programming examiner for the course "${courseTitle}".
Evaluate each student's code submission for correctness, efficiency, and clarity.
Provide:
- "score": a number between 0 and 1 (0 = completely wrong, 1 = perfect)
- "verdict": "correct", "partial", or "incorrect"
- "feedback": 2–3 sentences explaining what was good or missing
- "ideal_answer": the ideal solution text if given
Return STRICT JSON ONLY:

{
  "graded": [
    {
      "id": "code-1",
      "score": 0.85,
      "verdict": "partial",
      "feedback": "Good logic but missing handling for empty input.",
      "ideal_answer": "function reverseString(str){return str.split('').reverse().join('');}"
    }
  ]
}
`;

    const resp = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.3,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: JSON.stringify({ items }) },
      ],
    });

    let text = resp.choices?.[0]?.message?.content || '{"graded":[]}';
    text = text.replace(/```json/gi, "").replace(/```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      if (text.startsWith("[") && text.endsWith("]")) parsed = { graded: JSON.parse(text) };
      else throw new Error("AI returned invalid JSON");
    }

    const graded = Array.isArray(parsed?.graded)
      ? parsed.graded
      : Array.isArray(parsed)
      ? parsed
      : [];

    return res.json({ graded });
  } catch (err) {
    console.error("POST /code/grade error:", err);
    return res.status(500).json({ message: "Failed to grade code answers" });
  }
});

module.exports = router;
