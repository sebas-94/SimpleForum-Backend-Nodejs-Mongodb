'use strict'

// Libraries
const validator = require('validator');

// Models
const Topic = require('../models/topic');


// Controller functions
const controller = {

    test: function (req, res) {
        return res.status(200).send({
            message: 'Test Topic Controller'
        });
    },


    save: function (req, res) {

        // Get params
        let params = req.body;

        // Data validate
        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
            var validate_lang = !validator.isEmpty(params.lang);

        } catch (err) {
            return res.status(200).send({
                status: 'error',
                message: 'Empty data'
            });
        }


        if (validate_title && validate_content && validate_lang) {
            // Create object
            let topic = new Topic();

            // Set values
            topic.title = params.title;
            topic.content = params.content
            topic.code = params.code;
            topic.lang = params.lang;
            topic.user = req.user.sub; // Get from token

            // Save topic
            topic.save((err, topicStored) => {

                if (err || !topicStored) {
                    return res.status(404).send({
                        status: 'error',
                        topic: 'Topic has not been saved.'
                    });
                }

                // Return response
                return res.status(200).send({
                    status: 'success',
                    topic: topicStored
                });
            });






        } else {
            return res.status(200).send({
                status: 'error',
                message: 'Invalid data'
            });
        }


    },


    getTopics: function (req, res) {

        // Load pagination module (models/topic.js)

        // Get actual page
        var page = 1; // Default

        if (req.params.page) {
            page = parseInt(req.params.page);
        }

        // Set pagination options
        var options = {
            sort: { date: -1 },   // new to old [DESC]
            populate: 'user',    // get User object from id
            limit: 5,
            page: page
        };

        // Find pagination
        Topic.paginate({}, options, (err, topics) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Query error'
                });
            }
            if (!topics) {
                return res.status(404).send({
                    status: 'error',
                    message: 'Empty topics'
                });
            }
            // Return topics, total topics and total paginations
            return res.status(200).send({
                status: 'success',
                topics: topics.docs,
                totalDocs: topics.totalDocs,
                totalPages: topics.totalPages
            });
        });

    },


    getTopicsByUser: function (req, res) {
        // Get ID User
        var userId = req.params.user;

        // Find topics with user == userId
        Topic.find({
            user: userId
        })
            .sort([['date', 'descending']])
            .exec((err, topics) => {
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Query error'
                    });
                }
                if (!topics) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'Topics not found'
                    });
                }

                // Return response
                return res.status(200).send({
                    status: 'success',
                    topics
                });
            });
    },


    getTopic: function (req, res) {
        // Get ID from URL
        var topicId = req.params.id;

        // Find topic by ID
        Topic.findById(topicId)
            .populate('user')
            .populate('comments.user')
            .exec((err, topic) => {
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Query error'
                    });
                }
                if (!topic) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'Topic not found'
                    });
                }
                // Return response
                return res.status(200).send({
                    status: 'success',
                    topic
                });
            });
    },


    update: function (req, res) {
        // Get topic ID
        var topicId = req.params.id;

        // Get data
        var params = req.body;

        // Validate data
        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
            var validate_lang = !validator.isEmpty(params.lang);

        } catch (err) {
            return res.status(200).send({
                status: 'error',
                message: 'Empty data'
            });
        }


        if (validate_title && validate_content && validate_lang) {
            // Build new JSON
            var update = {
                title: params.title,
                content: params.content,
                code: params.code,
                lang: params.lang
            };

            // Find and update topic by topicID and userID
            let searchBy = {
                _id: topicId,
                user: req.user.sub
            };

            Topic.findByIdAndUpdate(searchBy, update, { new: true }, (err, TopicUpdate) => {
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Query error'
                    });
                }
                if (!TopicUpdate) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'Topic not updated'
                    });
                }
                // Return response
                return res.status(200).send({
                    status: 'success',
                    TopicUpdate
                });
            });

        } else {
            // Return response
            return res.status(200).send({
                status: 'error',
                message: 'Validation error'
            });
        }

    },


    delete: function (req, res) {
        // Get topic id from URL
        var topicId = req.params.id;

        // Find and delete by topicId and userId
        let searchBy = {
            _id: topicId,
            user: req.user.sub
        };

        Topic.findOneAndDelete(searchBy, (err, topicRemoved) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Query error'
                });
            }
            if (!topicRemoved) {
                return res.status(404).send({
                    status: 'error',
                    message: 'Topic not removed'
                });
            }
            // Return response
            return res.status(200).send({
                status: 'success',
                topic: topicRemoved
            });
        });

    }



};


module.exports = controller;