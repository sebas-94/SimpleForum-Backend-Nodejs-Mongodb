'use strict'

// Requires
var express = require('express');
var bodyParser = require('body-parser');

// Express
var app = express();

// Routes files
var user_routes = require('./routes/user');

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CORS


// Routers overwrites
app.use('/api', user_routes);


// Test route
app.get('/prueba', (req, res) => {
    return res.status(200).send({ 
        message: 'Hola mundo' 
    });
})


// Export
module.exports = app;