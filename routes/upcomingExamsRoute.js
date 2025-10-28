// backend/routes/upcomingExamsRoute.js
const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

// Helper function to remove quotes from environment variables
const cleanEnvVar = (value) => {
  if (!value) return '';
  return value.replace(/^["']|["']$/g, '');
};

// Clean the environment variables
const supabaseUrl = cleanEnvVar(process.env.SUPABASE_URL);
const supabaseKey = cleanEnvVar(process.env.SUPABASE_SERVICE_ROLE_KEY);

// Check if environment variables are loaded
if (!supabaseUrl || !supabaseKey) {
  console.error('❌ ERROR: Missing Supabase credentials in .env file');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// GET /api/upcoming-exams - Fetch all upcoming exams
router.get('/', async (req, res) => {
  try {
    // Get current date and time
    const now = new Date().toISOString();

    // Fetch all exams that are scheduled for now or in the future
    const { data: exams, error } = await supabase
      .from('exams')
      .select(`
        exam_id,
        title,
        instructions,
        duration,
        type,
        start_time,
        course_id,
        preparation_status,
        courses (
          course_code,
          title
        )
      `)
      .gte('start_time', now) // Greater than or equal to current time
      .order('start_time', { ascending: true });

    if (error) {
      console.error('Error fetching upcoming exams:', error);
      return res.status(500).json({ error: error.message });
    }

    console.log('✅ Fetched exams from database:', exams);

    // Transform the data to match your frontend structure
    const transformedExams = exams.map(exam => {
      // Parse start_time to extract date and time
      const startDateTime = new Date(exam.start_time);
      const examDate = startDateTime.toISOString().split('T')[0]; // YYYY-MM-DD
      const examTime = startDateTime.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });


      return {
        id: exam.exam_id,
        courseCode: exam.courses?.course_code || 'N/A',
        courseName: exam.courses?.title || exam.title || 'Unknown Course',
        examType: exam.type || 'Exam',
        date: examDate,
        time: examTime,
        duration: exam.duration ? `${exam.duration} minutes` : 'TBA',
        location: 'TBA', // Not in your database
        instructor: 'TBA', // Not in your database
        status: 'upcoming',
        enrolled: true,
        preparationStatus:exam.preparation_status || 'not-started', // Not in your database
        syllabus: exam.instructions || 'No instructions available',
        importantNotes: 'Check exam instructions carefully'
      };
    });

    console.log('✅ Transformed exams:', transformedExams);
    res.json(transformedExams);

  } catch (error) {
    console.error('❌ Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});




module.exports = router;