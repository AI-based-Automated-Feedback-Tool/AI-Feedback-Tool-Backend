const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

// Helper function to remove quotes from environment variables
const cleanEnvVar = (value) => {
  if (!value) return '';
  return value.replace(/^["']|["']$/g, '');
};

const supabaseUrl = cleanEnvVar(process.env.SUPABASE_URL);
const supabaseKey = cleanEnvVar(process.env.SUPABASE_SERVICE_ROLE_KEY);
const supabase = createClient(supabaseUrl, supabaseKey);

// PATCH /api/exams/:examId/preparation - Update preparation status
router.patch('/:examId/preparation', async (req, res) => {
  try {
    const { examId } = req.params;
    const { preparationStatus } = req.body;

    // Validate input
    if (!preparationStatus) {
      return res.status(400).json({ error: 'preparationStatus is required' });
    }

    const validStatuses = ['not-started', 'in-progress', 'completed'];
    if (!validStatuses.includes(preparationStatus)) {
      return res.status(400).json({ 
        error: 'Invalid status. Must be: not-started, in-progress, or completed' 
      });
    }

    // Update in database
    const { data, error } = await supabase
      .from('exams')
      .update({ preparation_status: preparationStatus })
      .eq('exam_id', examId)
      .select();

    if (error) {
      console.error('Error updating preparation status:', error);
      return res.status(500).json({ error: error.message });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    console.log(`✅ Updated exam ${examId} preparation status to: ${preparationStatus}`);
    res.json({ 
      success: true, 
      examId, 
      preparationStatus,
      message: 'Preparation status updated successfully' 
    });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;