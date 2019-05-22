const express = require('express');
const commentController = require ('../controllers/commentController');
const router = express.Router();
const md_auth = require('../middlewares/authenticated');

router.post('/comment/topic/:topicId', md_auth.authenticated, commentController.addComment);
router.put('/comment/:commentId', md_auth.authenticated, commentController.updateComment);
router.delete('/comment/:topicId/:commentId', md_auth.authenticated, commentController.deleteComment);

module.exports = router;