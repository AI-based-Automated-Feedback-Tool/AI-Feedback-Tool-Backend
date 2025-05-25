const {supabase} = require('../../supabaseClient')

async function getCourseCode({user_id}) {
    const {data, error } = await supabase
        .from('courses')
        .select('course_id, course_code, title')
        .eq('user_id', user_id)

    if (error) {
        const err = new Error("Failed to get the course code");
        err.status = 500;
        throw err;
    }

    if (!data || data.length === 0) {
        const err = new Error ("No courses found for you");
        err.status = 404;
        throw err;
    }
    return data;
}
module.exports = getCourseCode;
