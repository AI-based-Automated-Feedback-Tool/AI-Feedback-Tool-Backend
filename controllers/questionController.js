// controllers/questionController.js
const { supabase } = require("../supabaseClient");

exports.getQuestionsByExamId = async (req, res) => {
  const { examId } = req.params;

  const { data, error } = await supabase
    .from("mcq_questions")
    .select("*")
    .eq("exam_id", examId);

  if (error) return res.status(500).json({ error: error.message });

  const formatted = data.map((q) => ({
    id: q.id,
    question: q.question_text,
    options: [q.option_a, q.option_b, q.option_c, q.option_d],
  }));

  res.json(formatted);
};
