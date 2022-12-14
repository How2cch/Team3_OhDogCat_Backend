const express = require('express');
const router = express();
const authMiddleware = require('../middlewares/userAuth.js');
const authController = require('../controllers/userAuth');

router.post('/register', authMiddleware.registerRules, authController.userRegister);
router.post('/login', authMiddleware.loginRules, authController.userLogin);
router.get('/register/line', authController.userLineRegister);
router.post('/login/line', authController.userLineLogin);
router.get('/logout', authController.userLogout);
router.get('/verify', authController.userVerifyStatus);
router.post('/validation', authMiddleware.authVerify, authController.userAccountValidation);

module.exports = router;
