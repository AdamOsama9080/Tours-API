const express = require('express');
const router = express.Router();
const organizerController = require('../Controllers/organizerController');

router.post('/register', organizerController.registerOrganizer);
// router.post('/login', organizerController.login);
// router.post('/update-password', organizerController.updatePassword);
// router.post('/activate-organizer', organizerController.activateOrganizer);

router.get('/organizers', organizerController.getAllOrganizers);

router.patch('/organizers/toggle-activation/:id', organizerController.toggleActivation);


module.exports = router;
