'use strict'

var jwt = require('jwt-simple');
var secret = "clave-secreta-generar-token";
var moment = require('moment');


exports.authenticated = function (req, res, next) {

    // Check auth
    if (!req.headers.authorization) {
        return res.status(403).send({
            message: 'Empty authentication header'
        });
    }

    // Clear token
    var token = req.headers.authorization.replace(/['"]+/g, '');

    // Decode
    try {
        var payload = jwt.decode(token, secret);

        // Check expiration
        if (payload.exp <= moment().unix()) {
            return res.status(404).send({
                message: 'Token has expired'
            });
        }

    } catch (error) {
        return res.status(404).send({
            message: 'Invalid token'
        });
    }

    // Attach identified user
    req.user = payload;

    // Pass the action
    next();
}