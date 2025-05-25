const { supabase } = require('../../supabaseClient');

async function getStudentName({ course_id }) {
    //Get user_ids of students enrolled in the course
    const {data: studentCourses, error: courseError} = await supabase
        .from('student_courses')
        .select('student_id')
        .eq('course_id', course_id);

    if (courseError) {
        const err = new Error("Failed to get the student ids");
        err.status = 500;
        throw err;
    }

    const studentIds = studentCourses.map(student => student.student_id);
    if (studentIds.length === 0) {
        return []; // no students enrolled, return empty array 
    }

    //Get names of students using the user_ids
    const { data: students, error: userError } = await supabase
        .from('users')
        .select('user_id, name')
        .in('user_id', studentIds);

    if (userError) {
        const err = new Error("Failed to get the student names");
        err.status = 500;
        throw err;
    }
    return students;
}

module.exports = getStudentName;