const express = require('express');
const router = express();
const adminController = require('../controllers/userAdmin');
const authMiddleware = require('../middlewares/userAuth.js');

router.get('/', authMiddleware.authVerify, adminController.userGetProfile);
router.post('/edit/social_name', authMiddleware.authVerify, adminController.userEditSocialName);
router.post('/edit/name', authMiddleware.authVerify, adminController.userEditName);
router.post('/edit/phone', authMiddleware.authVerify, adminController.userEditPhone);
router.post('/edit/gender', authMiddleware.authVerify, adminController.userEditGender);
router.post('/edit/profile');
router.get('/voucher', adminController.userReadVouchers);
router.get('/voucher/exchange/:productId', adminController.userGetVouchersId);

module.exports = router;
