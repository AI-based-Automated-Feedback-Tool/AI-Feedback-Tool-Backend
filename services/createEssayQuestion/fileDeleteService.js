const { supabase } = require('../../supabaseClient');

async function deleteFileFromSupabase(filePath) {
    if (!filePath) {
        const err = new Error("File path is required");
        err.status = 400;
        throw err;
    }
    const {data, error:deleteError} = await supabase
        .storage
        .from('essay-attachments')
        .remove([filePath]);

        if (deleteError || !data || data.length === 0) {
            const err = new Error("Failed to delete file");
            err.status = 500;
            throw err;
        }
        return { success: true, message: "File deleted successfully" };
}
module.exports = { deleteFileFromSupabase };