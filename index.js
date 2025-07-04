// backend/index.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const questionRoutes = require("./routes/createQuestions");
const configureExamRoutes = require("./routes/configureExamRoutes");
const examRoutes = require("./routes/examRoutes");
const questionAPIRoutes = require("./routes/questionRoutes");
const getCourseCodeRoutes = require("./routes/reportsTeacher/getCourseCodeRoute"); // Importing the course code routes
const getExamTitleRoutes = require("./routes/reportsTeacher/getExamTitleRoutes"); // Importing the exam title routes
const getStudentNameRoutes = require("./routes/reportsTeacher/getStudentNameRoute"); // Importing the student name routes
const getExamSubmissionRoute = require("./routes/reportsTeacher/getExamSubmissionRoute");
const getMcqQuestionsRoutes = require("./routes/reportsTeacher/getMcqQuestionsRoutes");
const getSubmittedAnswersRoutes = require("./routes/reportsTeacher/getSubmittedAnswersRoute");
const aiRoutes = require("./routes/aiRoutes");
const getLanguagesRoute = require("./routes/createCodeQuestions/getLanguagesRoute");
const createCodeQuestionRoute = require("./routes/createCodeQuestions/createCodeQuestionRoute");
const mcqFeedbackRoutes = require("./routes/mcqFeedbackRoutes");
const getCodeQuestionRoute = require("./routes/getCodeQuestionsRoute");
const codeSubmissionRoutes = require("./routes/postCodeQuestions");
const fileUploadRoute = require('./routes/createEssayQuestions/fileUploadRoute');
const fileDeleteRoute = require('./routes/createEssayQuestions/fileDeleteRoute'); 
const createEssayQuestionRoute = require('./routes/createEssayQuestions/createEssayQuestionRoute'); 
const getCodeQuestionsRoute = require('./routes/reportsTeacher/getCodeQuestionsRoute');
const getCodeAnswersRoute = require('./routes/reportsTeacher/getSubmittedCodeAnswersRoute');
const getEssayQuestionsRoute = require('./routes/reportsTeacher/getEssayQuestionsRoute'); 
const getEssayAnswersRoute = require('./routes/reportsTeacher/getSubmittedEssayAnswersRoute');
const studentExamDetailsRoute = require('./routes/reportsTeacher/getStudentExamDetailsRoute'); 
const saveCourseRoute = require("./routes/registerCourse/registerCourseRoute");
const getExamDetailsRoute = require("./routes/examDetails/fetchExamDetailsRoute");
const editExamDetailsRoute = require("./routes/examDetails/editExamDetailsRoute");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send("Backend is running!");
});
// Use question routes
app.use("/api/createQuestions", questionRoutes);
// Use configure exam routes
app.use("/api/configureExam", configureExamRoutes);

// Route to fetch exams by course code, e.g., /api/exams/:courseCode
app.use("/api/exams", examRoutes);

// Route to fetch questions by exam ID, e.g., /api/questions/:examId
app.use("/api/questions", questionAPIRoutes);

//Route to fetch course codes by teacher ID
app.use("/api/teacher/reports/course", getCourseCodeRoutes);

// Route to fetch exam titles by course ID
app.use("/api/teacher/reports/exams", getExamTitleRoutes);

// Route to fetch student names by course ID
app.use("/api/teacher/reports/students", getStudentNameRoutes);

// Route to fetch exam submissions by exam ID
app.use("/api/teacher/reports/exam_submission", getExamSubmissionRoute);

// Route to fetch mcq questions by exam ID
app.use("/api/teacher/reports/mcq", getMcqQuestionsRoutes);

//Route to fetch submitted answers by submission ID
app.use("/api/teacher/reports/submitted_answers", getSubmittedAnswersRoutes);

app.use("/api/ai", aiRoutes);

//Route to fetch programming languages
app.use("/api/createCodeQuestions/languages", getLanguagesRoute);

//Route to create code questions
app.use("/api/createCodeQuestion", createCodeQuestionRoute);
// Route to fetch all code questions
app.use("/api/codequestions", getCodeQuestionRoute);

// Route for MCQ feedback generation
app.use("/api/mcq-feedback", mcqFeedbackRoutes);
//to submit code questions
app.use("/api/code-submission", codeSubmissionRoutes);

// Route to handle file uploads for essay questions
app.use("/api/upload", fileUploadRoute);

// Route to handle file deletion for essay questions
app.use("/api/essayQuestions/delete-attachment", fileDeleteRoute);

// Route to create essay questions
app.use("/api/createEssayQuestion", createEssayQuestionRoute);

// Route to fetch code questions by exam ID
app.use("/api/teacher/reports/code_questions", getCodeQuestionsRoute);

// Route to fetch submitted code answers by submission ID
app.use("/api/teacher/reports/submitted_code_answers", getCodeAnswersRoute);

// Route to fetch essay questions by exam ID
app.use("/api/teacher/reports/essay_questions", getEssayQuestionsRoute);

// Route to fetch submitted essay answers by submission ID
app.use("/api/teacher/reports/submitted_essay_answers", getEssayAnswersRoute);

// Route to fetch student exam details by submission ID and student ID
app.use("/api/teacher/reports/student_exam_details", studentExamDetailsRoute);

// Route to save course
app.use("/api/registerCourse", saveCourseRoute);

// Route to fetch exam details by exam ID
app.use("/api/examDetails", getExamDetailsRoute);

// Route to edit exam details
app.use("/api/editExamDetails", editExamDetailsRoute);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
