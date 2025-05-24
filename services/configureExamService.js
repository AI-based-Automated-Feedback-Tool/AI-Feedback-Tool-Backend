const { supabase } = require("../supabaseClient");

const createExamConfiguration = async (examData) => {
  const { data, error } = await supabase
    .from('exams')
    .insert({
      title: examData.title,
      course_id: examData.course_id,
      instructions: examData.instructions,
      duration: examData.duration,
      type: examData.type,
      question_count: examData.question_count,
      ai_assessment_guide: examData.ai_assessment_guide,
      user_id: examData.user_id 
    })
    .select();

  if (error) {
    console.error('Supabase error:', error);
    throw new Error('Failed to save exam configuration');
  }
  return data[0];
};

module.exports = {
  createExamConfiguration
};