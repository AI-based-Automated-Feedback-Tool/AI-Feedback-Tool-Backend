const supabase = require('../supabaseClient'); 

async function addQuestionToExam({exam_id, question_text, options, answers, no_of_correct_answers, points, user_id}) {
    //check the exam belongs to the cuurent user
    const {data: exam, error: examError} = await supabase 
        .from ('exams')
        .select('exam_id, user_id')
        .eq('exam_id', exam_id)
        .single()
    
    // Check if the exam exists and if the user_id matches
    if (examError) {
        const err = new Error("Failed to verify the exam");
        err.status = 500;
        throw err;
    }
    if (!exam) {
        const err = new Error("Exam not found");
        err.status = 404;
        throw err;
    }
    if(exam.user_id !== user_id) {
        const err = new Error("You are not allowed to add questions to this exam")
        err.status = 403;
        throw err;
    }

    // Inserting the question into the questions table
    const {data, error} = await supabase
        .from('mcq_questions')
        .insert([
            {
                exam_id,
                question_text,
                options,
                answers,
                no_of_correct_answers,
                points
            }
        ])
        .select(); 
        
    // Check if the question was added successfully
    if (error) {
        const err = new Error("Failed to add question");
        err.status = 500;
        throw err;
    }
    return data // Return the added question data
}

module.exports = addQuestionToExam
