const {supabase} = require('../../supabaseClient');

async function getCodeQuestions({exam_id}) {
    const { data, error } = await supabase
        .from('code_questions')
        .select('*')
        .eq('exam_id', exam_id);

        if (error) {
            const err = new Error ("Failed to get the code questions")
            err.status = 500;
            throw err;
        }
        return data;
}

module.exports = getCodeQuestions;