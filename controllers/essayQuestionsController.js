const { supabase } = require('../supabaseClient');
const { v4: uuidv4 } = require('uuid');


// Fetch essay questions by exam ID
const getEssayQuestionsByExamId = async (req, res) => {
    const { examId } = req.params;
    console.log('Fetching essay questions for exam ID:', examId);

    const examIdTrimmed = examId.trim();
    console.log('Trimmed examId:', examIdTrimmed);

    const { data, error } = await supabase
        .from('essay_questions')
        .select('*')
        .eq('exam_id', examId);

          console.log('Query result:', data);
          console.log('Query error:', error);

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.json(data);
};

// Submit essay answers
const submitEssayAnswers = async (req, res) => {
    try {
        const { student_id, exam_id, submission_id, answers } = req.body;

        if (!student_id || !exam_id || !submission_id || !answers || answers.length === 0) {
            return res.status(400).json({ error: "Missing required fields or answers." });
        }

        const formattedAnswers = answers.map(answer => ({
            submission_id,
            question_id: answer.question_id,
            student_answer: answer.student_answer
        }));

        const { data, error } = await supabase
            .from('essay_exam_submissions_answers')
            .insert(formattedAnswers);

        if (error) {
            console.error('Error inserting answers:', error);
            return res.status(500).json({ error: 'Failed to submit answers.' });
        }

        res.status(201).json({ message: 'Essay answers submitted successfully.', data });

    } catch (error) {
        console.error('Server error during submission:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getEssayQuestionsByExamId,
    submitEssayAnswers
};
