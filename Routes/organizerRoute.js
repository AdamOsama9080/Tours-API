const express = require('express');
const router = express.Router();
const organizerController = require('../Controllers/organizerController');

router.post('/register', organizerController.registerOrganizer);
// router.post('/login', organizerController.login);
// router.post('/update-password', organizerController.updatePassword);
// router.post('/activate-organizer', organizerController.activateOrganizer);


module.exports = router;
