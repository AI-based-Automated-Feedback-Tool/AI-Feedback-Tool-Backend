const { supabase } = require('../../supabaseClient');

async function getCodeQuestions() {
    try {
        const { data, error } = await supabase
            .from('code_questions')
            .select('*'); //fetch all columns from the code_questions table

        if (error) {
            console.error("Supabase error:", error);
            const err = new Error("Failed to fetch code questions");
            err.status = 500;
            throw err;
        }

        if (!data || data.length === 0) {
            const err = new Error("No code questions found");
            err.status = 404;
            throw err;
        }

        return data; //return the fetched code questions
    } catch (err) {
        throw err; //propagate the error to the caller
    }
}

module.exports = getCodeQuestions;