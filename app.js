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