// backend/index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const questionRoutes = require('./routes/createQuestions');
const configureExamRoutes = require('./routes/configureExamRoutes');
const examRoutes = require('./routes/examRoutes');
const questionAPIRoutes = require('./routes/questionRoutes'); 
const getCourseCodeRoutes = require('./routes/reportsTeacher/getCourseCodeRoute'); // Importing the course code routes
const getExamTitleRoutes = require('./routes/reportsTeacher/getExamTitleRoutes'); // Importing the exam title routes
const getStudentNameRoutes = require('./routes/reportsTeacher/getStudentNameRoute'); // Importing the student name routes
const cohereRoute = require('./routes/cohereRoute');
const getExamSubmissionRoute = require('./routes/reportsTeacher/getExamSubmissionRoute')
const getMcqQuestionsRoutes = require('./routes/reportsTeacher/getMcqQuestionsRoutes')
const getSubmittedAnswersRoutes = require('./routes/reportsTeacher/getSubmittedAnswersRoute'); 
const aiRoutes = require('./routes/aiRoutes');
const getLanguagesRoute = require('./routes/createCodeQuestions/getLanguagesRoute'); 

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.send('Backend is running!');
});
// Use question routes
app.use('/api/createQuestions', questionRoutes);
// Use configure exam routes
app.use('/api/configureExam', configureExamRoutes);

// Route to fetch exams by course code, e.g., /api/exams/:courseCode
app.use('/api/exams', examRoutes);

// Route to fetch questions by exam ID, e.g., /api/questions/:examId
app.use('/api/questions', questionAPIRoutes);

//Route to fetch course codes by teacher ID
app.use('/api/teacher/reports/course', getCourseCodeRoutes  );

// Route to fetch exam titles by course ID
app.use('/api/teacher/reports/exams', getExamTitleRoutes)

// Route to fetch student names by course ID
app.use('/api/teacher/reports/students', getStudentNameRoutes);

app.use('/api/cohere', cohereRoute);

// Route to fetch exam submissions by exam ID
app.use('/api/teacher/reports/exam_submission', getExamSubmissionRoute)

// Route to fetch mcq questions by exam ID
app.use('/api/teacher/reports/mcq', getMcqQuestionsRoutes)

//Route to fetch submitted answers by submission ID
app.use('/api/teacher/reports/submitted_answers', getSubmittedAnswersRoutes);


app.use('/api/ai', aiRoutes);

//Route to fetch programming languages
app.use('/api/createCodeQuestions/languages', getLanguagesRoute);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});