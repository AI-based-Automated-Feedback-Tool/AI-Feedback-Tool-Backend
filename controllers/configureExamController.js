const configureExamService = require('../services/configureExamService');

const saveExamConfiguration = async (req, res) => {
   
  try {
    if (!req.body.title || !req.body.course_code) {
      return res.status(400).json({ error: 'Title and Course ID are required' });
    }

    const examConfig = await configureExamService.createExamConfiguration(req.body);    
    
    res.status(201).json({
      success: true,
      examId: examConfig.exam_id,
      message: 'Exam configuration saved successfully'
    });
  } catch (error) {
    console.error('Configuration error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to save exam configuration'
    });
  }
};

module.exports = {
  saveExamConfiguration
};