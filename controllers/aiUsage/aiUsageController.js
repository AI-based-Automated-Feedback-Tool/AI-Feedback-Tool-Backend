const {getAICallsCount} = require('../../services/aiUsage/aiUsageService')

const getAICallUsage = async (req, res) => {
    try {
        const userId = req.user.id;
        const usageCount = await getAICallsCount(userId);
        res.status(200).json({ usageCount });
    } catch (error) {
        console.error('Error getting AI call usage:', error);
        res.status(500).json({ error: 'Failed to get AI call usage' });
    }
}
module.exports = {
    getAICallUsage
};