const { supabase } = require('../../supabaseClient');

async function getCodeQuestions({ exam_id, course_id }) {
    try {
        let query = supabase.from('code_questions').select('*');

        if (exam_id) {
            query = query.eq('exam_id', exam_id);
        } else if (course_id) {
            query = query.eq('course_id', course_id);
        }

        const { data, error } = await query;

        if (error) {
            console.error("Supabase error:", error);
            const err = new Error("Failed to fetch code questions");
            err.status = 500;
            throw err;
        }

        if (!data || data.length === 0) {
            const err = new Error("No code questions found");
            err.status = 404;
            throw err;
        }

        return data;
    } catch (err) {
        throw err;
    }
}

module.exports = getCodeQuestions;
