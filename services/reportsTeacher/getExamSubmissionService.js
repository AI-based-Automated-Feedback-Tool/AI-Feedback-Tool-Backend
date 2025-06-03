const {supabase} = require('../../supabaseClient')

async function getExamSubmission({exam_id}) {
    const { data,error } = await supabase
        .from('exam_submissions')
        .select('*')
        .eq('exam_id', exam_id)

    if (error) {
        console.error("Supabase error:", error);
        const err = new Error("Failed to get the exam submission details");
        err.status = 500;
        throw err;
    }

    return data;
}

module.exports = getExamSubmission;