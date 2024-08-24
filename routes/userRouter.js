const express = require('express');
const userController = require('../controller/userController');
const authController = require('../controller/authController');
const OAuthController = require('../controller/OAuthController');
// const passport = require('passport');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/get-user', authController.protect, authController.getUserData);
router.post('/forget-password', authController.forgetPassword);
router.patch('/reset-password/:token', authController.resetPassword);
router.get(
  '/get-user-data',
  authController.protect,
  authController.getUserData,
);
router.patch(
  '/update-my-password',
  authController.protect,
  authController.updatePassword,
);

module.exports = router;
