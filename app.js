'use strict'

// Requires
const express = require('express');
const bodyParser = require('body-parser');

// Express
const app = express();

// Routes files
const user_routes = require('./routes/user');
const topic_routes = require('./routes/topic');
const comment_routes = require('./routes/comment');

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


// Routers overwrites
app.use('/api', user_routes);
app.use('/api', topic_routes);
app.use('/api', comment_routes);

// Test route
app.get('/prueba', (req, res) => {
    return res.status(200).send({
        message: 'Hola mundo'
    });
})


// Export
module.exports = app;