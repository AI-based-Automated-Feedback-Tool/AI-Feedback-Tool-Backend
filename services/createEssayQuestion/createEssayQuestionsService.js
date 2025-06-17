const {supabase} = require('../../supabaseClient')

async function createEssayQuestions({exam_id, question_text, attachment_url, word_limit, points, grading_note, user_id}) {
    const {data: essayExam, error: examError} = await supabase
        .from('exams')
        .select('exam_id, user_id')
        .eq('exam_id', exam_id)
        .single();

    // Check if the exam exists and if the user_id matches
    if (examError) {
        const err = new Error("Failed to verify the exam");
        err.status = 500;
        throw err;
    }
    if (!essayExam) {
        const err = new Error("Exam not found");
        err.status = 404;
        throw err;
    }
    if (essayExam.user_id !== user_id) {
        const err = new Error("You are not allowed to add questions to this exam");
        err.status = 403;
        throw err;
    }

    // Inserting the essay question into the essay_questions table
    const {data, error} = await supabase
        .from('essay_questions')
        .insert([
            {
                exam_id,
                question_text,
                attachment_url,
                word_limit,
                points,
                grading_note
            }
        ])
        .select();

    // Check if the question was added successfully
    if (error) {
        const err = new Error("Failed to add essay question");
        err.status = 500;
        throw err;
    }
    return data; 
    
}
module.exports = createEssayQuestions