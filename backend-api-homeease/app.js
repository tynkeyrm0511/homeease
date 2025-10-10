// Load enviroment variables from .env file
require('dotenv').config();

// Import required libraries
const express = require('express');
const app = express();

// Import middleware configuration
const { applyMiddlewares } = require('./middleware/middleware');

// Import routes
const homeRoute = require('./routes/home');
const residentRoute = require('./routes/resident');
const invoiceRoute = require('./routes/invoice');
const requestRoute = require('./routes/request');
const notificationRoute = require('./routes/notification');
const authRoute = require('./routes/auth');

// Apply middleware
applyMiddlewares(app);

// Define application routes
app.use('/', homeRoute);
app.use('/resident', residentRoute);
app.use('/invoice', invoiceRoute);
app.use('/request', requestRoute);
app.use('/notification', notificationRoute);
app.use('/auth', authRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Đã xảy ra lỗi server!' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});