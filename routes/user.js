'use strict'

const express = require('express');
const router = express.Router();

// Modules
const multipart = require('connect-multiparty');

// Controller
const UserController = require('../controllers/user');

// Middlewares User
const md_auth = require('../middlewares/authenticated');
const md_upload = multipart({ uploadDir: './uploads/users' });

// Routes
router.get('/testUser', UserController.test);
router.post('/register', UserController.save);
router.post('/login', UserController.login);
router.put('/update', md_auth.authenticated, UserController.update);
router.post('/upload-avatar', [md_auth.authenticated, md_upload], UserController.uploadAvatar);
router.get('/avatar/:fileName', UserController.avatar);
router.get('/users', UserController.getUsers);
router.get('/user/:userId', UserController.getUser);


module.exports = router;