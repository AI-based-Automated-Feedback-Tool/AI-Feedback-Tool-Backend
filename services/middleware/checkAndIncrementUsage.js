const { supabase } = require('../../supabaseClient');

const DAILY_LIMITS = {
    'cohere': 5,
    'deepseek': 5
};

async function checkAndIncrementUsage(userId, aiModel) {
    const today = new Date().toISOString().slice(0, 10);

    //try to get existing usage record
    let { data: usageRecord, error: fetchError } = await supabase
        .from('ai_usage')
        .select('*')
        .eq('user_id', userId)
        .eq('date', today)
        .eq('model_name', aiModel)
        .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116: No rows found
        throw new Error('Failed to fetch usage record');
    }

    if (!usageRecord) {
        // No record for today, create one
        const { data, error: insertError } = await supabase
            .from('ai_usage')
            .insert([{
                user_id: userId,
                date: today,
                model_name: aiModel,
                call_count: 1
            }]);

        if (insertError) {
            throw new Error('Failed to create usage record');
        } else {
            return true; 
        }
    }

    // Record exists, check limit
    if (usageRecord.call_count >= DAILY_LIMITS[aiModel]) {
        return false; 
    } else {
        // Increment call count
        const { data, error: updateError } = await supabase
            .from('ai_usage')
            .update({ call_count: usageRecord.call_count + 1 })
            .eq('user_id', userId)
            .eq('date', today)
            .eq('model_name', aiModel);

        if (updateError) {
            throw new Error('Failed to update usage record');
        } else {
            return true; 
        }
    }

}