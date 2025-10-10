const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const express = require('express');

const applyMiddlewares = (app) => {
    app.use(morgan('dev')); // Logging HTTP requests
    app.use(cors());        // Allow requests from frontend
    app.use(helmet());      // Enhanced security
    app.use(express.json()); // Handle JSON data from client
    app.use(express.urlencoded({ extended: true })); // Handle form data
};

module.exports = { applyMiddlewares };