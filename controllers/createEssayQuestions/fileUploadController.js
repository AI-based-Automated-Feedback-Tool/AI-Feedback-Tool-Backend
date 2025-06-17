const {saveFileToSupabase} = require("../../services/createEssayQuestion/fileUploadService");

const uploadEssayAttachment  = async (req,res) => {
    try{
        const file = req.file; 
        if (!file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        const publicUrl = await saveFileToSupabase(file);
        return res.status(200).json({ message: "File uploaded successfully", url: publicUrl });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = { uploadEssayAttachment  };