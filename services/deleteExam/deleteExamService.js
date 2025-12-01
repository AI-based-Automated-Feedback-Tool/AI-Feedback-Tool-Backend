const {supabase} = require('../../supabaseClient');

async function deleteExam({exam_id}) {
    if (!exam_id) {
        const err = new Error("Exam ID is required");
        err.status = 400;
        throw err;
    }
    // check examid exists
    const {data: examData, error: examError} = await supabase
        .from('exams')
        .select('exam_id')
        .eq('exam_id', exam_id)
        .single();

    if (examError) {
        const err = new Error("Error checking exam existence");
        err.status = 500;
        throw err;
    }
    if (!examData) {
        const err = new Error("Exam not found");
        err.status = 404;
        throw err;
    }
    
    // delete the exam
    const {error: deleteError} = await supabase
        .from('exams')
        .delete()
        .eq('exam_id', exam_id);

    if (deleteError) {
        const err = new Error("Failed to delete exam");
        err.status = 500;
        throw err;
    }
    return {
        success: true,
        message: "Exam deleted successfully"
    };
}
module.exports = {deleteExam};