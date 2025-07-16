const { supabase } = require('../supabaseClient');

// Submit essay answers
const submitEssayAnswers = async (req, res) => {
    try {
        const { student_id, exam_id, submission_id, answers } = req.body;

        if (!student_id || !exam_id || !submission_id || !answers || answers.length === 0) {
            return res.status(400).json({ error: "Missing required fields or answers." });
        }

        // Format answers for insertion
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
    submitEssayAnswers
};
