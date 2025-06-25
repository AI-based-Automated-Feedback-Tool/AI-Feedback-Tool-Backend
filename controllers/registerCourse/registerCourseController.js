const registerCourse = require('../../services/registerCourse/registerCourseService.js')
const saveCourse = async (req, res) => {
    try {
        const course = await registerCourse(req.body)
        res.status(201).json({message: "Course created successfully", course}) 
    } catch (error) {
        res.status(error.status || 500).json({message:error.message}) 
    }
}    

module.exports = {saveCourse}; 