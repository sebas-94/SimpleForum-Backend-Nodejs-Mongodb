'use strict'

const express = require('express');
const router = express.Router();

// Controller
const CommentController = require('../controllers/comment');

// Middlewares
const md_auth = require('../middlewares/authenticated');

// Routes
router.get('/testComment', CommentController.test);
router.post('/comment/topic/:topicId', md_auth.authenticated, CommentController.add);
router.put('/comment/:commentId', md_auth.authenticated, CommentController.update);
router.delete('/comment/:topicId/:commentId', md_auth.authenticated, CommentController.delete);
router.get('/search/:search', CommentController.search);


module.exports = router;