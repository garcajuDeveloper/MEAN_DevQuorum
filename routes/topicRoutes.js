const express = require('express');
const topicController = require ('../controllers/topicController');
const router = express.Router();
const md_auth = require('../middlewares/authenticated');

router.get('/test/', topicController.test);
router.post('/save/', md_auth.authenticated, topicController.save);
router.get('/topics/:page?', topicController.getTopics );

module.exports = router;