const { supabase } = require('../../supabaseClient');

async function saveFileToSupabase(file) {
    const filePath = `attachments/${Date.now()}_${file.originalname}`;
    const {data:upload , error:uploadError} = await supabase.storage
        .from('essay-attachments')
        .upload(filePath, file.buffer, {
            contentType: file.mimetype,
            upsert: false
        });
        if (uploadError) {
            const err = new Error("Failed to upload file");
            console.log(uploadError);
            err.status = 500;
            throw err;
        }

        const {data:publicUrlData} = supabase.storage
            .from('essay-attachments')
            .getPublicUrl(filePath);
        if (!publicUrlData) {
            const err = new Error("Failed to get public URL for the file");
            err.status = 500;
            throw err;
        }
        return publicUrlData;
}
module.exports = {saveFileToSupabase};