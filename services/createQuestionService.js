const supabase = require('../supabaseClient'); 

async function addQuestionToExam({exam_id, question_text, options, answers, type, points, teacher_id}) {
    
    // Inserting the question into the questions table
    const {data, error} = await supabase
        .from('questions')
        .insert([
            {
                exam_id,
                question_text,
                options,
                answers,
                type,
                points
            }
        ])
        .select(); 
   
    return data // Return the added question data
}

module.exports = addQuestionToExam
