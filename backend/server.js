// backend/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const expenseRoutes = require('./routes/expenseRoutes');

const authRoutes = require('./routes/authRoutes');  // Make sure this is correct
const connectDB = require('./config/db');  // Import the db.js file for DB connection

dotenv.config(); // Load environment variables
const app = express();

// Middleware
app.use(express.json());  // Parse incoming JSON data
app.use(cors());  // Enable CORS for cross-origin requests

// Connect to the database
connectDB();

// Routes
app.use('/api/auth', authRoutes);  // Authentication routes
app.use('/api/expenses', expenseRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
