const express = require('express');
const router = express.Router();
const registerController = require('../Controllers/registerController');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

router.post('/Signup', registerController.signup);
router.post('/verify-otp', registerController.verifyOTP);
router.post('/update-profile', upload.single('profilePicture'), registerController.updateProfile);
router.post ('/profile' , registerController.getProfilePicture);

module.exports = router;