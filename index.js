// backend/index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const questionRoutes = require('./routes/createQuestions');

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

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});