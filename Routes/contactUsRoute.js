const express = require('express');
const router = express.Router();
const contactController = require('../Controllers/contactUsController');

router.post('/contact', contactController.sendMessage);

module.exports = router;
