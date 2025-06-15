const { supabase } = require('../../supabaseClient');

async function deleteFileFromSupabase(filePath) {
    const {error:deleteError} = await supabase
        .storage
        .from('essay-attachments')
        .remove([filePath]);

        if (deleteError) {
            const err = new Error("Failed to delete file");
            err.status = 500;
            throw err;
        }
        return { success: true, message: "File deleted successfully" };
}
module.exports = { deleteFileFromSupabase };