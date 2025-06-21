const {supabase} = require('../../supabaseClient');

async function getStudentExamDetails({exam_id, student_id}) {

    const { data, error } = await supabase
        .from('exam_submissions') // start from the base table
        .select(`
            student_id,
            submitted_at,
            total_score,
            time_taken,
            focus_loss_count,
            feedback_summery,
            exam_id,
            users ( name ),
            exam_submissions_answers (
                student_answer,
                is_correct,
                score,
                mcq_questions (
                    question_text
                )
            )
        `)
        .eq('exam_id', exam_id)
        .eq('student_id', student_id);

        if (error) {
            const err = new Error ("Failed to get the exam details for the student");
            err.status = 500;
            throw err;
        }
        return data;
}

module.exports = getStudentExamDetails;