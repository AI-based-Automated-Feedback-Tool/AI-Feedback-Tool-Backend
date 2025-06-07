const {supabase} = require('../../supabaseClient'); 

async function getLanguages() {
    const {data, error } = await supabase
        .from('programming_languages')
        .select('*')
        .order('language_name', { ascending: true });

    if (error) {
        const err = new Error("Failed to get the programming languages");
        err.status = 500;
        throw err;
    }

    if (!data || data.length === 0) {
        const err = new Error ("No programming languages found");
        err.status = 404;
        throw err;
    }
    return data;
}
module.exports = {getLanguages};
