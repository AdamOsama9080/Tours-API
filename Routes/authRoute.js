const express = require('express');
const { login, forgetPassword, resetPassword , SignUpOrLoginWithGoogle , getRoleOfUser} = require('../Controllers/authController');
const router = express.Router();

router.post('/login',login);

router.post('/forget-password', forgetPassword);

router.post('/reset-password', resetPassword);

router.post('/signinOrSignupWithGoogle', SignUpOrLoginWithGoogle);

// router.post('/get-User-Role', getRoleOfUser)

module.exports = router;
