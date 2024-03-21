const express = require('express');
const router = express.Router();
const registerController = require('../Controllers/registerController');

router.post('/Signup', registerController.signup);
router.post('/verify-otp', registerController.verifyOTP);

module.exports = router;