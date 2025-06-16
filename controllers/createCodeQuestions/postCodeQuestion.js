const { supabase } = require("../../supabaseClient");

exports.submitCodeAnswers = async (req, res) => {
  const { userId, exam_id, answers, timeTaken, focusLossCount } = req.body;

  if (!userId || !exam_id || !Array.isArray(answers)) {
    return res.status(400).json({ error: "Missing required data" });
  }

  try {
    // Insert into exam_submissions
    const { data: submissionData, error: submissionError } = await supabase
      .from("exam_submissions")
      .insert([
        {
          submitted_at: new Date().toISOString(),
          student_id: userId,
          exam_id: exam_id,
          total_score: 0, // will be updated later
          time_taken: timeTaken,
          focus_loss_count: focusLossCount,
        },
      ])
      .select();

    if (submissionError) {
      console.error(submissionError);
      return res.status(500).json({ error: "Submission insert failed" });
    }

    const submissionId = submissionData[0].id;
    let totalScore = 0;
    const results = [];

    for (const answer of answers) {
      const { questionId, code } = answer;

      // Fetch code question info
      const { data: question, error: questionError } = await supabase
        .from("code_questions")
        .select("*")
        .eq("id", questionId)
        .single();

      if (questionError || !question) {
        console.warn(`Failed to fetch question ${questionId}`);
        continue;
      }

      //hardcoded score and correctness
      const isCorrect = false;
      const score = 0;
      totalScore += score;

      results.push({
        student_answer: code,
        is_correct: isCorrect,
        score,
        ai_feedback: "Great attempt! Consider edge cases and improve code readability.",
        question_id: questionId,
        submission_id: submissionId,
      });
    }

    await supabase.from("exam_submissions_answers").insert(results);

    await supabase
      .from("exam_submissions")
      .update({ total_score: totalScore })
      .eq("id", submissionId);

    return res.status(200).json({ success: true, totalScore, submissionId });
  } catch (err) {
    console.error("Controller error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
