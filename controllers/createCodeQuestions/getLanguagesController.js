const { getLanguages } = require('../../services/createCodeQuestion/getLanguageService');


const getLanguagesController = async (req, res) => {
    try {
        const languages = await getLanguages();
        res.status(200).json({
            message: "Programming languages retrieved successfully",
            languages
        });
    } catch (error) {
        res.status(error.status || 500).json({
            message: error.message
        });
    }
}

module.exports = { getLanguagesController };