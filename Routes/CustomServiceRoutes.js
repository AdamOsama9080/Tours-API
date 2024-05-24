const express = require('express');
const router = express.Router();
const apiController = require('../Controllers/customServiceController');

router.post('/details', apiController.getDetails); 

module.exports = router;