const express = require('express');
const router = express.Router();
const favouritController = require('../Controllers/favourritsController');

router.post('/add-favourit', favouritController.addFavourit);
router.get('/get-favourits/:userId', favouritController.getFavouritsbyUserId);
router.delete('/remove-favourit', favouritController.removeFavourit);

module.exports = router