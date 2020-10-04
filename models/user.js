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

// Remove the password property for public requests
UserSchema.methods.toJSON = function () {
    var obj = this.toObject();
    delete obj.password;
    return obj;
}


module.exports = mongoose.model('User', UserSchema);
                                // Lowercase and pluralize