'use strict'

const db_route = 'mongodb://localhost:27017/api_rest_node';

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3999;


mongoose.Promise = global.Promise;

mongoose.connect(db_route, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connection OK');

        // Servidor
        app.listen(port, () => {
            console.log('Servidor OK');
        })

    })
    .catch(error => console.log(console.error()));