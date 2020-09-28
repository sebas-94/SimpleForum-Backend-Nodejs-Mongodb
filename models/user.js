'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
    name: String,
    surnmae: String,
    email: String,
    password: String,
    image: String,
    role: String
});


module.exports = mongoose.model('User', UserSchema);
                                // Lowercase and pluralize