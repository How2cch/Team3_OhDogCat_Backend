const express = require('express');
const router = express();
const authMiddleware = require('../middlewares/userAuth.js');
const authController = require('../controllers/userAuth');

router.post('/register', authMiddleware.registerRules, authController.userRegister);

module.exports = router;
