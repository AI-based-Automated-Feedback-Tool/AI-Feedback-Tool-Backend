const { supabase } = require("../../supabaseClient");
const OpenAI = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Fetch all courses the student is registered in.
 * Tables:
 *  - student_courses: { student_id, course_id }
 *  - courses: { course_id, title }
 */
async function getRegisteredCoursesService(studentId) {
  // 1️⃣ Get the student's registered course IDs
  const { data: enrolledRows, error: enrolledErr } = await supabase
    .from("student_courses")
    .select("course_id")
    .eq("student_id", studentId);

  if (enrolledErr) {
    throw new Error(`student_courses query failed: ${enrolledErr.message}`);
  }

  const courseIds = (enrolledRows || []).map(row => row.course_id).filter(Boolean);
  if (courseIds.length === 0) {
    return []; // no courses found for this student
  }

  // 2️⃣ Get the course details for those course IDs
  const { data: courses, error: coursesErr } = await supabase
    .from("courses")
    .select("course_id, title")
    .in("course_id", courseIds);

  if (coursesErr) {
    throw new Error(`courses query failed: ${coursesErr.message}`);
  }

  // 3️⃣ Normalize the response (frontend expects id + title)
  const formattedCourses = (courses || []).map(c => ({
    id: c.course_id,
    title: c.title || "Untitled Course",
  }));

  return formattedCourses;
}

/**
 * Generate 25 AI-based MCQ questions for the selected course
 */
async function generateMcqService(courseTitle) {
  const prompt = `
Generate 25 multiple-choice questions (MCQs) for the course "${courseTitle}".
Each question must have exactly 4 options and include the correct answer.
Return ONLY valid JSON (no markdown fences) in this format:

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
    return Array.isArray(arr) ? arr.slice(0, 25) : [];
  }
}

module.exports = {
  getRegisteredCoursesService,
  generateMcqService,
};
