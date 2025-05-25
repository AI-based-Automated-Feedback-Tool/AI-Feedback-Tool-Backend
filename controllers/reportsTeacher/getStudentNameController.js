const getNameOfStudent = require('../../services/reportsTeacher/getStudentNameService'); // Importing the getNameOfStudent function from the service layer

const getStudentName = async (req, res) => {
    try{
        const { course_id } = req.query; 
        if (!course_id) {
            const err = new Error("Course ID is required. Please select course id");
            err.status = 400; 
            throw err;
        }
        const students = await getNameOfStudent({ course_id }); // Calling the service function to get student names
        
        res.status(200).json({
            message: "Student names retrieved successfully", 
            students
        });
    } catch (error) {
        res.status(error.status || 500).json({
            message: error.message
        });
    }
}
module.exports = { getStudentName };