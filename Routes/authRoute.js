const express = require('express');
const { login, forgetPassword, resetPassword , SignUpOrLoginWithGoogle} = require('../Controllers/authController');
const router = express.Router();

router.post('/login',login);

router.post('/forget-password', forgetPassword);

router.post('/reset-password', resetPassword);

router.post('/signinOrSignupWithGoogle', SignUpOrLoginWithGoogle);

module.exports = router;
