const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const connectDB = async () => {
    try {
      await mongoose.connect(config.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      });
      console.log(`Connected to MongoDB database: ${mongoose.connection.name}`);
      console.log(`Host: ${mongoose.connection.host}`);
  console.log(`Port: ${mongoose.connection.port}`);
    } catch (err) {
      console.error('MongoDB connection error:', err);
      process.exit(1); // Exit process with failure
    }
  };
  
  // Call the connect function
  connectDB();
// Basic route
app.get('/', (req, res) => {
  res.send('Task Management System API');
});

// Start server
app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});