'use strict'

// Libraries
const validator = require('validator');
const bcrypt = require('bcrypt-node');
const jwt = require('../services/jwt');
const fs = require('fs');
const path = require('path');

// Models
const User = require('../models/user');


// Controller functions
const controller = {

    test: function (req, res) {
        return res.status(200).send({
            message: "Test User Controller"
        });
    },


    save: function (req, res) {
        // Get parameters
        var params = req.body;

        // Data validate
        try {
            var validate_name = !validator.isEmpty(params.name);
            var validate_surname = !validator.isEmpty(params.surname);
            var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
            var validate_password = !validator.isEmpty(params.password);

        } catch (error) {
            return res.status(200).send({
                message: "Empty params",
                params
            });
        }

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

        // Data validate
        try {
            var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
            var validate_password = !validator.isEmpty(params.password);

        } catch (error) {
            return res.status(200).send({
                message: "Empty params",
                params
            });
        }


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

    },


    update: function (req, res) {

        // Get params
        var params = req.body;

        // Data validate
        try {
            var validate_name = !validator.isEmpty(params.name);
            var validate_surname = !validator.isEmpty(params.surname);
            var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);

        } catch (error) {
            return res.status(200).send({
                message: "Empty params",
                params
            });
        }


        // Delete unnecessary properties
        delete params.password;

        // Search and update document
        var userId = req.user.sub;

        // Check if email is unique
        if (req.user.email != params.email) {

            // Search email user
            User.findOne({ email: params.email.toLowerCase() }, (err, user) => {

                if (err) {
                    return res.status(500).send({
                        message: "Error checking email."
                    });
                }

                // Check user
                if (user && user.email == params.email) {
                    return res.status(200).send({
                        message: "Email already exists in the database."
                    });

                } else {
                    // Condition, update data, options, callback
                    User.findByIdAndUpdate({ _id: userId }, params, { new: true }, (err, userUpdated) => {
                        // Return response

                        if (err) {
                            return res.status(500).send({
                                status: 'error',
                                user: 'Update user error'
                            });
                        }

                        if (!userUpdated) {
                            return res.status(500).send({
                                status: 'error',
                                user: 'User not updated'
                            });
                        }

                        return res.status(200).send({
                            status: 'success',
                            user: userUpdated
                        });

                    });
                }

            });


        } else {
            // Condition, update data, options, callback
            User.findByIdAndUpdate({ _id: userId }, params, { new: true }, (err, userUpdated) => {
                // Return response

                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        user: 'Update user error'
                    });
                }

                if (!userUpdated) {
                    return res.status(500).send({
                        status: 'error',
                        user: 'User not updated'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    user: userUpdated
                });

            });
        }

    },


    uploadAvatar: function (req, res) {
        // Config multiparty module (middleware) --> routes/user.js

        // Check if file exist
        if (Object.keys(req.files).length == 0) {
            return res.status(404).send({
                status: 'error',
                message: 'Empty file'
            });
        }

        // Get file name and file extesion
        let file_path = req.files.file0.path;
        let file_name = file_path.split('/')[2];
        let file_ext = file_name.split('.')[1];

        // If file extension is invalid, delete file
        if (file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif') {

            fs.unlink(file_path, (err) => {
                return res.status(200).send({
                    status: 'error',
                    message: 'Inavalid extension'
                });
            });

        } else {
            // Get id user
            let userId = req.user.sub;

            // Search and update document on DB
            User.findByIdAndUpdate({ _id: userId }, { image: file_name }, { new: true }, (err, userUpdated) => {

                if (err || !userUpdated) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error saving image to database',
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    user: userUpdated
                });

            })

        }

    },


    avatar: function (req, res) {
        let fileName = req.params.fileName;
        let filePath = './uploads/users/' + fileName;

        fs.stat(filePath, (err) => {
            if (!err) {
                res.sendFile(path.resolve(filePath));
            } else {
                return res.status(404).send({
                    message: 'Image not found',
                });
            }
        });
    },


    getUsers: function (req, res) {
        User.find().exec((err, users) => {
            if (err || !users) {
                return res.status(404).send({
                    status: 'error',
                    message: 'There are no users to display'
                });
            }

            return res.status(200).send({
                status: 'success',
                users
            });
        })
    },


    getUser: function (req, res) {
        let userId = req.params.userId;

        User.findById(userId).exec((err, user) => {
            if (err || !user) {
                return res.status(404).send({
                    status: 'error',
                    message: `There is no user ${userId}`
                });
            }

            return res.status(200).send({
                status: 'success',
                user
            });
        });
    },

}


module.exports = controller;