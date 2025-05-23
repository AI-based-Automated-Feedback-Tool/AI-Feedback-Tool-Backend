const  getCourseCode = require('../services/getCourseCodeService');
const getCourseCodeController = async (req, res) => {
    try {
        const {userId} = req.params;
        if (!userId) {
            const err = new Error("User ID is required");
            err.status = 400;
            throw err;
        }
        const courses = await getCourseCode({user_id: userId});
        if (!courses || courses.length === 0) {
            const err = new Error("No courses found for this user");
            err.status = 404;
            throw err;
        }
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