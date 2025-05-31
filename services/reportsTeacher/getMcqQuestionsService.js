const {supabase} = require('../../supabaseClient')

async function getMcqQuestions({exam_id}) {
    const { data,error } = await supabase
        .from('mcq_questions')
        .select('*')
        .eq('exam_id', exam_id)

    if (error) {
        console.error("Supabase error:", error);
        const err = new Error("Failed to get the mcq questions");
        err.status = 500;
        throw err;
    }

    return data;
}

module.exports = getMcqQuestions;