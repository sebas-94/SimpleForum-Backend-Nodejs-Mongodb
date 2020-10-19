'use strict'

const express = require('express');
const router = express.Router();

// Modules
//const multipart = require('connect-multiparty');

// Controller
const TopicController = require('../controllers/topic');

// Middlewares
const md_auth = require('../middlewares/authenticated');

// Routes
router.get('/testTopic', TopicController.test);
router.post('/topic', md_auth.authenticated, TopicController.save);
router.get('/topics/:page?', TopicController.getTopics);
router.get('/user-topics/:user', TopicController.getTopicsByUser);
router.get('/topic/:id', TopicController.getTopic);
router.put('/topic/:id', md_auth.authenticated, TopicController.update);
router.delete('/topic/:id', md_auth.authenticated, TopicController.delete);
router.get('/search/:search', TopicController.search);


module.exports = router;