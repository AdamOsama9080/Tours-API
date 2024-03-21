// Route: emailRoute.js
const express = require('express');
const router = express.Router();
const emailController = require('../Controllers/sendmailwithAPIDocumentionController');

router.post('/send-email', emailController.sendEmail);

module.exports = router;
