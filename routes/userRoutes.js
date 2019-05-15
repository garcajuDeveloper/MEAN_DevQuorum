const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();
const md_auth = require('../middlewares/authenticated');
const multiparty = require('connect-multiparty');
const md_upload = multiparty({uploadDir: './uploads/users'});

//User routes
router.post('/register', userController.save);
router.post('/login', userController.login);
router.put('/update', md_auth.authenticated, userController.update);
router.post('/avatar', [md_auth.authenticated, md_upload], userController.uploadAvatar);
router.get('/avatar/:fileName', userController.getAvatar);
router.get('/users/', userController.getUsers);
router.get('/users/:userID', userController.getUser);

module.exports = router;