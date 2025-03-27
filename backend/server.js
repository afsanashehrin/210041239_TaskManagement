const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(config.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Basic route
app.get('/', (req, res) => {
  res.send('Task Management System API');
});

// Start server
app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});