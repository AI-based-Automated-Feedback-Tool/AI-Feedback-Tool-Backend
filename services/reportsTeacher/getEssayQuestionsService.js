const {supabase} = require('../../supabaseClient');

async function getEssayQuestions({exam_id}) {
    const { data, error } = await supabase
        .from('essay_questions')
        .select('*')
        .eq('exam_id', exam_id);

        if (error) {
            const err = new Error ("Failed to get the essay questions")
            err.status = 500;
            throw err;
        }
        return data;
}

module.exports = getEssayQuestions;