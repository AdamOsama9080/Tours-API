const express = require('express');
const router = express.Router();
const couponController = require('../Controllers/couponController');

router.post('/validate-coupon', couponController.validateCoupon);
module.exports = router
