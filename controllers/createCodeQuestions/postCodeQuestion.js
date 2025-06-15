const { supabase } = require('../../supabaseClient');

async function postExamSubmission(submissionData, answers) {
    try {
          // Fetch the authenticated user's user_id
          const { data: { user }, error: userError } = await supabase.auth.getUser();
          if (userError || !user) {
              console.error("Error fetching user:", userError);
              throw new Error("User not authenticated");
          }
          const userId = user.id;
  
        // Insert submission data including student_id and exam_id
        const { data: submission, error: submissionError } = await supabase
            .from('exam_submissions')
            .insert([{
                student_id: userId,
                exam_id: submissionData.exam_id,
                total_score: submissionData.total_score || 0,
                time_taken: submissionData.time_taken, 
                focus_loss_count: submissionData.focus_loss_count, 
                feedback_summery: submissionData.feedback_summery || null,
                submitted_at: new Date().toISOString()
            }])
            .select(); //fetch the inserted record for further processing

        if (submissionError) {
            console.error("Error inserting into exam_submissions:", submissionError);
            throw new Error("Failed to insert exam submission");
        }

        const submissionId = submission[0].id;

        const answersWithSubmissionId = answers.map(answer => ({
            student_answer: answer.student_answer,
            is_correct: answer.is_correct,
            score: answer.score,
            ai_feedback: answer.ai_feedback,
            question_id: answer.question_id,
            submission_id: submissionId,
            model_answer_basic: answer.model_answer_basic || "N/A",
            model_answer_advanced: answer.model_answer_advanced || "N/A"
        }));

        const { data: answersData, error: answersError } = await supabase
            .from('exam_submissions_answers')
            .insert(answersWithSubmissionId);

        if (answersError) {
            console.error("Error inserting into exam_submissions_answer:", answersError);
            throw new Error("Failed to insert exam submission answers");
        }

        return {
            submission: submission[0], 
            answers: answersData 
        };
    } catch (err) {
        console.error("Error in postExamSubmission:", err);
        throw err;
    }
}

module.exports = postExamSubmission;
