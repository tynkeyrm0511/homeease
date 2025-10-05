// Load enviroment variables from .env file
require('dotenv').config();

//Import required libraries
const express = require('express');

//Import middleware configuration
const applyMiddlewares = require('./middleware/middleware');

//Initialize the Express application
const app = express();

//Apply global middlewares
applyMiddlewares(app);

//Import routes
const homeRoute = require('./routes/home');
const residentRoute = require('./routes/resident');
const invoiceRoute = require('./routes/invoice');
const requestRoute = require('./routes/request');

//Database testing
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

app.get('/test-db', async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Database connection failed' });
    }
});

//Define application routes
app.use('/', homeRoute);
app.use('/resident', residentRoute);
app.use('/invoice', invoiceRoute);
app.use('/request', requestRoute);

//Handle errors
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