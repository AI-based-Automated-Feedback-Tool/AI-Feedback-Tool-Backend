const { supabase } = require('../../supabaseClient');

const DAILY_LIMITS = {
    'cohere': 5,
    'deepseek': 5
};

async function getAICallsCount(userId) {
    const today = new Date().toLocaleDateString('en-CA');
    console.log(today);

    const { data: usageRecords, error: fetchError } = await supabase
        .from('ai_usage')
        .select('*')
        .eq('user_id', userId)
        .eq('date', today);

        if (fetchError) {
            console.error('Error fetching usage records:', fetchError);
            throw new Error('Failed to fetch usage records');
        }
        let totalCalls = {};

        for( const model of Object.keys(DAILY_LIMITS)) {
            const usage = usageRecords.find(record => record.model_name === model);
            totalCalls[model] = usage ? usage.call_count : 0;
        }

        return totalCalls;
}

module.exports = {
    getAICallsCount
};