const {supabase} = require('../../supabaseClient')

async function registerCourse({ user_id, title, description, course_code }) {
    const {data: course, error: courseError} = await supabase
        .from('courses')
        .select('course_code')
        .eq('course_code', course_code)
        .maybeSingle(); // This avoids throwing error when no match is found
    // Check if there was an error while fetching the course
     if (courseError) {
        const err = new Error("Error checking for existing course");
        err.status = 500;
        throw err;
    }
    // Check if the course exists
    if (course) {
        const err = new Error("Course already exists with this code");
        err.status =  400;
        throw err;
    }

    // Inserting the course into the courses table
    const {data, error} = await supabase
        .from('courses')
        .insert([
            {
                title,
                description,
                user_id,
                course_code
            }
        ])
        .select();

    // Check if the course was added successfully
    if (error) {
        const err = new Error("Failed to add course");
        err.status = 500;
        throw err;
    }
    return data;

}
module.exports = registerCourse;
                