const {supabase} = require('../../supabaseClient');

async function getStudentExamDetails({exam_id, student_id, exam_type}) {
    let query = null;
    if (exam_type === 'mcq') {
        query = (`
            student_id,
            submitted_at,
            total_score,
            time_taken,
            focus_loss_count,
            feedback_summary,
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
        `);
    } else if (exam_type === 'essay') {
        query = (`
            student_id,
            submitted_at,
            total_score,
            time_taken,
            focus_loss_count,
            feedback_summary,
            exam_id,
            users ( name ),
            essay_exam_submissions_answers (
                student_answer,
                is_correct,
                score,
                essay_questions (
                    question_text
                )
            )
        `);
    } else if (exam_type === 'code') {
        query = (`
            student_id,
            submitted_at,
            total_score,
            time_taken,
            focus_loss_count,
            feedback_summary,
            exam_id,
            users ( name ),
            code_submissions_answers (
                student_answer,
                is_correct,
                score,
                code_questions (
                    question_description
                )
            )
        `);
    }

    const { data, error } = await supabase
        .from('exam_submissions')
        .select(query)
        .eq('exam_id', exam_id)
        .eq('student_id', student_id);

        if (error) {
            console.error("Supabase error:", error);
            const err = new Error ("Failed to get the exam details for the student");
            err.status = 500;
            throw err;
        }
        return data;
}

module.exports = getStudentExamDetails;