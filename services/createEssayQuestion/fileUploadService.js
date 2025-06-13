const { supabase } = require('../../supabaseClient');

async function saveFileToSupabase(file) {
    const filePath = `attachments/${Date.now()}_${file.originalname}`;
    const {data , error} = await supabase.storage
        .from('essay-attachments')
        .upload(filePath, file.buffer, {
            contentType: file.mimetype,
            upsert: true
        });
        if (error) {
            const err = new Error("Failed to upload file");
            console.log(error);
            err.status = 500;
            throw err;
        }

        const {publicUrl} = supabase.storage
            .from('essay-attachments')
            .getPublicUrl(filePath).data;
        return publicUrl;
}
module.exports = {saveFileToSupabase};