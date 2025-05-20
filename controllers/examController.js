// controllers/examController.js
const { supabase } = require("../supabaseClient");

exports.getExamsByCourseCode = async (req, res) => {
  const { courseCode } = req.params;

  const { data, error } = await supabase
    .from("exams")
    .select("*")
    .eq("course_code", courseCode);

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
};
