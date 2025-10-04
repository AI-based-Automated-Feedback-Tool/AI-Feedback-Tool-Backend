const {
  getRegisteredCoursesService,
  generateMcqService,
} = require("../../services/mockExam/mockExamService");

/**
 * GET /api/mock-exam/courses/:studentId
 */
async function getRegisteredCourses(req, res) {
  try {
    const { studentId } = req.params;
    if (!studentId) {
      return res.status(400).json({ message: "studentId is required" });
    }
    const courses = await getRegisteredCoursesService(studentId);
    return res.json({ courses });
  } catch (error) {
    console.error("getRegisteredCourses error:", error);
    // ⬇️ send the real message so the frontend shows what went wrong
    return res.status(500).json({ message: error.message || "Failed to fetch courses" });
  }
}

/**
 * POST /api/mock-exam/generate
 * body: { courseTitle: string }
 */
async function generateMockExam(req, res) {
  try {
    const { courseTitle } = req.body;
    if (!courseTitle) {
      return res.status(400).json({ message: "courseTitle is required" });
    }
    const questions = await generateMcqService(courseTitle);
    return res.json({ questions });
  } catch (error) {
    console.error("generateMockExam error:", error);
    return res.status(500).json({ message: error.message || "Failed to generate mock exam" });
  }
}

module.exports = {
  getRegisteredCourses,
  generateMockExam,
};
