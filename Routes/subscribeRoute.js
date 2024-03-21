const express = require('express');
const router = express.Router();
const subscribeController = require('../Controllers/subscribeController');

router.post('/subscribe', subscribeController.sendSubscriptionEmail);

module.exports = router