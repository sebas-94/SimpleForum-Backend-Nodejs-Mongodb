'use strict'

var validator = require('validator');
var bcrypt = require('bcrypt-node');
var User = require('../models/user');
const jwt = require('../services/jwt');

var controller = {

    probando: function (req, res) {
        return res.status(200).send({ message: "probando" });
    },

    testeando: function (req, res) {
        return res.status(200).send({ message: "testeando" });
    },

    save: function (req, res) {
        // Get parameters
        var params = req.body;

        // Validate data
        var validate_name = !validator.isEmpty(params.name);
        var validate_surname = !validator.isEmpty(params.surname);
        var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
        var validate_password = !validator.isEmpty(params.password);

        // console.log(validate_name, validate_surname, validate_email, validate_password);

        if (validate_name && validate_surname && validate_password && validate_email) {
            // Create object
            var user = new User();

            // Assign values
            user.name = params.name;
            user.surname = params.surname;
            user.email = params.email.toLowerCase();
            user.role = 'ROLE_USER';
            user.image = null;

            // Check if exists
            User.findOne({ email: user.email }, (err, issetUser) => {

                if (err) {
                    // Return response
                    return res.status(500).send({
                        message: "Error checking User"
                    });
                }


                if (!issetUser) {
                    // If doesn't exist, encrypt the password
                    bcrypt.hash(params.password, null, null, (err, hash) => {
                        user.password = hash;

                        //Save user
                        user.save((err, userStored) => {
                            if (err) {
                                return res.status(500).send({
                                    message: "Error saving user",
                                });
                            }

                            if (!userStored) {
                                // Return response
                                return res.status(400).send({
                                    message: "User hasn't been saved",
                                });
                            } else {
                                // Return response
                                return res.status(200).send({
                                    message: "User stored",
                                    user: userStored
                                });
                            }
                        });// Close save

                    });// Close bcrypt

                } else {
                    // Return response
                    return res.status(200).send({
                        message: "User already exists"
                    });
                }

            });

        } else {
            // Return response
            return res.status(200).send({
                message: "User register FAIL. Validation FAIL.",
                params
            });
        }

    },


    login: function (req, res) {
        // Get parameters
        var params = req.body;

        // Validate data
        var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
        var validate_password = !validator.isEmpty(params.password);

        if (validate_email && validate_password) {
            // Search email user
            User.findOne({ email: params.email.toLowerCase() }, (err, user) => {

                if (err) {
                    return res.status(500).send({
                        message: "Error login user."
                    });
                }

                // Check user
                if (!user) {
                    return res.status(404).send({
                        message: "User doesn't exist."
                    });
                }

                // If user exist: Check password
                bcrypt.compare(params.password, user.password, (err, check) => {

                    // If password is correct
                    if (check) {

                        // Generate JWT token
                        if (params.gettoken) {
                            // Return data
                            return res.status(200).send({
                                token: jwt.createToken(user)
                            });
                        }

                        // Clean credentials before returning the object
                        user.password = undefined;

                        // Return data
                        return res.status(200).send({
                            message: "User login OK.",
                            user
                        });

                    } else {
                        // Return data
                        return res.status(200).send({
                            message: "Bad credentials."
                        });
                    }
                });

            });

        } else {
            // Return data
            return res.status(200).send({
                message: "User login FAIL. Validation FAIL.",
                params
            });
        }

    }

}


module.exports = controller;