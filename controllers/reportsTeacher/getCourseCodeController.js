const  getCourseCode = require('../../services/reportsTeacher/getCourseCodeService'); // Importing the getCourseCode function from the service layer
const getCourseCodeController = async (req, res) => {
    try {
        const {userId} = req.query; 
        if (!userId) {
            const err = new Error("User ID is required");
            err.status = 400;
            throw err;
        }
        const courses = await getCourseCode({user_id: userId});
        
        res.status(200).json({
            message: "Course code retrieved successfully", 
            courses
        });
    } catch (error) {
        res.status(error.status || 500).json({
            message: error.message
        });
    }
}

module.exports = {getCourseCodeController};