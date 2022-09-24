const express = require('express');
const router = express();
const adminController = require('../controllers/userAdmin');
const authMiddleware = require('../middlewares/userAuth.js');

router.post('/edit/social_name', authMiddleware.authVerify, adminController.userEditSocialName);

module.exports = router;
