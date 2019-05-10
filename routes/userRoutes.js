const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

router.get('/testing', userController.test);

router.post('/register', userController.save);

module.exports = router;