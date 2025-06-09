const {supabase} = require('../../supabaseClient')

async function createCodeQuestion({exam_id, question_text, function_signature, wrapper_code, test_cases, language_id, points, user_id}) {
    const {data: codeExam, error: examError} = await supabase
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
    if (!codeExam) {
        const err = new Error("Exam not found");
        err.status = 404;
        throw err;
    }
    if (codeExam.user_id !== user_id) {
        const err = new Error("You are not allowed to add questions to this exam");
        err.status = 403;
        throw err;
    }

    // Inserting the code question into the code_questions table
    const {data, error} = await supabase
        .from('code_questions')
        .insert([
            {
                exam_id,
                question_text,
                function_signature,
                wrapper_code,
                test_cases,
                language_id,
                points
            }
        ])
        .select();

    // Check if the question was added successfully
    if (error) {
        const err = new Error("Failed to add code question");
        err.status = 500;
        throw err;
    }
    return data; // Return the added code question data
    
}
module.exports = createCodeQuestion