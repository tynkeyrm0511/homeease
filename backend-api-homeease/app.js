// Load enviroment variables from .env file
require('dotenv').config();

// Import required libraries
const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');

// Import middleware configuration
const { applyMiddlewares } = require('./middleware/middleware');

// Import routes
const homeRoute = require('./routes/home');
const residentRoute = require('./routes/resident');
const invoiceRoute = require('./routes/invoice');
const requestRoute = require('./routes/request');
const notificationRoute = require('./routes/notification');
const authRoute = require('./routes/auth');
const profileRoute = require('./routes/profile');

// Apply middleware
applyMiddlewares(app);

// Define application routes
app.use('/', homeRoute);
app.use('/resident', residentRoute);
app.use('/invoice', invoiceRoute);
app.use('/request', requestRoute);
app.use('/notification', notificationRoute);
app.use('/auth', authRoute);
app.use('/profile', profileRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Đã xảy ra lỗi server!' });
});

// Create HTTP server and attach Socket.IO
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
app.locals.io = io;

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);
  socket.on('disconnect', () => console.log('Socket disconnected:', socket.id));
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});