const { supabase } = require('../../supabaseClient');

async function fetchExamDetails({ exam_id }) {
    //Get user_ids of students enrolled in the course
    const {data: exam, error: examError} = await supabase
        .from('exams')
        .select('*')
        .eq('exam_id', exam_id)
        .single();

    if (examError) throw examError;

    //Conditionally fetch questions based on exam type
    let questions = [];

    if (exam.type === 'mcq') {
        const { data: mcqs, error: mcqError } = await supabase
            .from('mcq_questions')
            .select('*')
            .eq('exam_id', exam_id);
        if (mcqError) throw mcqError;
        questions = mcqs;
    } else if (exam.type === 'essay') {
        const { data: essays, error: essayError } = await supabase
            .from('essay_questions')
            .select('*')
            .eq('exam_id', exam_id);
        if (essayError) throw essayError;
        questions = essays;
  } else if (exam.type === 'code') {
        const { data: codes, error: codeError } = await supabase
            .from('code_questions')
            .select('*')
            .eq('exam_id', exam_id);
        if (codeError) throw codeError;
        questions = codes;
  }
  return {
    ...exam,
    questions
  };
        
}

module.exports = fetchExamDetails;