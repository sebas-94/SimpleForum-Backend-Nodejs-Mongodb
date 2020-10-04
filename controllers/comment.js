'use strict'

// Libraries
const validator = require('validator');

// Models
const Topic = require('../models/topic');

// Controller functions
const controller = {

    test: function (req, res) {
        return res.status(200).send({
            message: 'Test Comment Controller'
        });
    },


    add: function (req, res) {
        // Get topicId from URL
        var topicId = req.params.topicId;

        // Find topicId
        Topic.findById(topicId).exec((err, topic) => {

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

            // Validate data
            if (req.body.content) {

                try {
                    var validate_content = !validator.isEmpty(req.body.content);
                } catch (err) {
                    return res.status(200).send({
                        status: 'error',
                        message: 'Empty data'
                    });
                }


                if (validate_content) {
                    // Create object
                    let comment = {
                        user: req.user.sub,
                        content: req.body.content
                    }

                    // Push comment into comments array
                    topic.comments.push(comment);

                    // Save topic completely
                    topic.save((err) => {
                        if (err) {
                            return res.status(500).send({
                                status: 'error',
                                message: 'Error saving topic'
                            });
                        }
                        // Return response
                        return res.status(200).send({
                            status: 'success',
                            topic
                        });
                    });
                }

            }


        })


    },


    update: function (req, res) {
        // Get commentId from URL
        let commentId = req.params.commentId;

        // Get data
        var params = req.body;

        // Validate data
        try {
            var validate_content = !validator.isEmpty(params.content);
        } catch (err) {
            return res.status(200).send({
                status: 'error',
                message: 'Empty data'
            });
        }

        // Find and update subdocument
        if (validate_content) {
            Topic.findOneAndUpdate(
                { 'comments._id': commentId },// Search
                { '$set': { 'comments.$.content': params.content } },// Set
                { new: true },  //Return new
                (err, topicUpdated) => { // Callback
                    if (err) {
                        return res.status(500).send({
                            status: 'error',
                            message: 'Query error'
                        });
                    }
                    if (!topicUpdated) {
                        return res.status(404).send({
                            status: 'error',
                            message: 'Topic not found'
                        });
                    }
                    // Return response
                    return res.status(200).send({
                        status: 'success',
                        topicUpdated
                    });
                }
            );
        }


    },


    delete: function (req, res) {
        // Get topicId and commentId
        let topicId = req.params.topicId;
        let commentId = req.params.commentId;

        // Search topic
        Topic.findById(topicId, (err, topic) => {
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

            // Select subdocument (comment)
            var comment = topic.comments.id(commentId);

            // Delete subdocument (comment)
            if (comment) {

                comment.remove();

                // Save document (topic)
                topic.save((err) => {
                    if (err) {
                        return res.status(500).send({
                            status: 'error',
                            message: 'Error saving topic'
                        });
                    }

                    // Return response
                    return res.status(200).send({
                        status: 'success',
                        topic
                    });
                });

            } else {
                return res.status(404).send({
                    status: 'error',
                    message: 'Comment not found'
                });
            }


        });

    }


}


module.exports = controller;