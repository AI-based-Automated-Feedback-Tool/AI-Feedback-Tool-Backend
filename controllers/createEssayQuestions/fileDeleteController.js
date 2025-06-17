const {deleteFileFromSupabase} = require("../../services/createEssayQuestion/fileDeleteService");

const deleteEssayAttachment  = async (req,res) => {
    try{
        const filePath = req.body.filePath; 
        const decodedFilePath = decodeURIComponent(filePath);
        if (!filePath) {
            return res.status(400).json({ message: "No file path provided" });
        }
        const result = await deleteFileFromSupabase(decodedFilePath);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(error.status || 500).json({ error: error.message || "Internal Server Error" });
    }
}

module.exports = { deleteEssayAttachment };