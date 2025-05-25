const {supabase} = require('../../supabaseClient')

async function getExamTitle({course_id}) {
    const { data,error } = await supabase
        .from('exams')
        .select('exam_id, title')
        .eq('course_id', course_id)

    if (error) {
        const err = new Error("Failed to get the exam title");
        err.status = 500;
        throw err;
    }

    return data;
}

module.exports = getExamTitle;