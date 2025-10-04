// Load enviroment variables from .env file
require('dotenv').config();

//Import required libraries
const express = require('express');

//Import middleware configuration
const applyMiddlewares = require('./middleware');

//Initialize the Express application
const app = express();

//Apply global middlewares
applyMiddlewares(app);

//Import routes
const homeRoute = require('./routes/home');
const residentRoute = require('./routes/resident');
const invoiceRoute = require('./routes/invoice');

//Define application routes
app.use('/', homeRoute);
app.use('/resident', residentRoute);
app.use('/invoice', invoiceRoute);

//Hanle errors
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({error: 'Internal Server Error'});
});

//Handle 404 not found
app.use((req,res) => {
    res.status(404).json({error: 'Route not found'});
});

//Define the server PORT
const PORT = process.env.PORT || 3000;

//Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});