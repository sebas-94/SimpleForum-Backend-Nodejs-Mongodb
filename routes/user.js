'use strict'

var express = require('express');
var router = express.Router();


var UserController = require('../controllers/user');

// Tests routers
router.get('/probando', UserController.probando);
router.get('/testeando', UserController.testeando);

// Routes
router.post('/register', UserController.save);
router.post('/login', UserController.login);


module.exports = router;