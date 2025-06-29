const { supabase } = require('../../supabaseClient');

async function editExamDetails({ examData }) {
    const { questions, ...examDetails } = examData;
    // Update the exam details in the exams table
    const { data: updatedExam, error: examError } = await supabase
        .from('exams')
        .update(examDetails)
        .eq('exam_id', examData.exam_id)
        .select('*')
        .single();

    if (examError) throw examError;

    // If the exam type is mcq and questions are provided, update the mcq_questions table
    if (examData.type === 'mcq' && questions ) {
         for (const question of questions) {
            if (!question.question_id) {
                throw new Error("Question ID is required for MCQ questions");
            }
            const { data: updatedQuestion, error: questionError } = await supabase
                .from('mcq_questions')
                .update(question)
                .eq('question_id', question.question_id)
                .select('*')
                .single();
            if (questionError) throw questionError;
         }
         
    }

    // If the exam type is essay and questions are provided, update the essay_questions table
    if (examData.type === 'essay' && questions) {
        for (const question of questions) {
            if (!question.question_id) {
                throw new Error("Question ID is required for essay questions");
            }
            const { data: updatedQuestion, error: questionError } = await supabase
                .from('essay_questions')
                .update(question)
                .eq('question_id', question.question_id)
                .select('*')
                .single();
            if (questionError) throw questionError;
        }
    }

    // If the exam type is code and questions are provided, update the code_questions table
    if (examData.type === 'code' && questions) {
        for (const question of questions) {
            if (!question.question_id) {
                throw new Error("Question ID is required for code questions");
            }
            const { data: updatedQuestion, error: questionError } = await supabase
                .from('code_questions')
                .update(question)
                .eq('question_id', question.question_id)
                .select('*')
                .single();
            if (questionError) throw questionError;
        }
    }

    return updatedExam;
}
module.exports = { editExamDetails };