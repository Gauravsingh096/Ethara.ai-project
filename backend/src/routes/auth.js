const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validate, signupRules, loginRules } = require('../validators/authValidators');

router.post('/signup', signupRules, validate, authController.signup);
router.post('/login', loginRules, validate, authController.login);
router.post('/refresh', authController.refreshToken);
router.post('/logout', protect, authController.logout);
router.get('/me', protect, authController.getMe);

module.exports = router;
