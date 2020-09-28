'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Topic Model
var TopicSchema = Schema({
    title: String,
    content: String,
    code: String,
    lang: String,
    date: {type: Date, default: Date.now},
    user: {type: Schema.ObjectId, ref: 'User'},
    comments: [CommentSchema]
});

// Comment Model
var CommentSchema = Schema({
    content: String,
    date: {type: Date, default: Date.now},
    user: {type: Schema.ObjectId, ref: 'User'}
});


module.exports = mongoose.model('Topic', TopicSchema);
                                // Lowercase and pluralize