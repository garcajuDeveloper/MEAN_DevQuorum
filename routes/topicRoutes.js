const express = require('express');
const topicController = require ('../controllers/topicController');
const router = express.Router();
const md_auth = require('../middlewares/authenticated');

router.post('/save/', md_auth.authenticated, topicController.save);
router.get('/topics/:page?', topicController.getTopics );
router.get('/topic-user/:user', topicController.getTopicsByUser);
router.get('/topic/:topicId', topicController.getTopic);
router.put('/topic/:id', md_auth.authenticated, topicController.updateTopic);
router.delete('/topic/:id', md_auth.authenticated, topicController.deleteTopic);

module.exports = router;