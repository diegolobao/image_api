const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');
const authMiddleware = require('../middleware/auth');

router.post('/generate-post', authMiddleware, imageController.generatePost);

module.exports = router;
