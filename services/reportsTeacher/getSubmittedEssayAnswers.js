const {supabase} = require('../../supabaseClient')

async function getSubmittedEssayAnswers({submission_id}) {
    const { data,error } = await supabase
        .from('essay_exam_submissions_answers')
        .select('*')
        .eq('submission_id', submission_id)

    if (error) {
        console.error("Supabase error:", error);
        const err = new Error("Failed to get the submitted answer details");
        err.status = 500;
        throw err;
    }

    return data;
}

module.exports = getSubmittedEssayAnswers;