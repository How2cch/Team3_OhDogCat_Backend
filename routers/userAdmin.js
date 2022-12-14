const express = require('express');
const router = express();
const adminController = require('../controllers/userAdmin');
const authMiddleware = require('../middlewares/userAuth.js');
const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
  // 存儲目的地
  destination: async function (req, file, callback) {
    // ? callback 第一個參數為錯誤時的執行，但目前只是在設定存儲路徑，不會用到，所以設為 null
    callback(null, path.join(__dirname, '..', 'public', 'user', 'uploads'));
  },
  // 檔案名稱
  filename: function (req, file, callback) {
    // ? 找出副檔名
    const ext = file.originalname.split('.').pop();
    // ? 設定即將被存進去的圖片檔名
    callback(null, `user-${Date.now()}.${ext}`);
  },
});

const messageImgStorage = multer.diskStorage({
  // 存儲目的地
  destination: async function (req, file, callback) {
    // ? callback 第一個參數為錯誤時的執行，但目前只是在設定存儲路徑，不會用到，所以設為 null
    callback(null, path.join(__dirname, '..', 'public', 'conversation', 'uploads'));
  },
  // 檔案名稱
  filename: function (req, file, callback) {
    // ? 找出副檔名
    const ext = file.originalname.split('.').pop();
    // ? 設定即將被存進去的圖片檔名
    callback(null, `user-${Date.now()}.${ext}`);
  },
});

const uploader = multer({
  // 選擇存儲的設定
  storage: storage,
  // 過濾圖片的種類，目前只接受下列三種
  fileFilter: function (req, file, cb) {
    if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/png') {
      // ? 圖片無法通過過濾時的處理
      cb(new Error('只接受 jpeg、jpg，png 的圖片檔案'), false);
    } else {
      // ? 圖片過濾沒問題
      cb(null, true);
    }
  },
  // 過濾檔案的大小
  limits: {
    // ? 單位為 byte
    fileSize: 2000 * 1024,
  },
});

const messageImgUploader = multer({
  // 選擇存儲的設定
  storage: messageImgStorage,
  // 過濾圖片的種類，目前只接受下列三種
  fileFilter: function (req, file, cb) {
    if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/png') {
      // ? 圖片無法通過過濾時的處理
      cb(new Error('只接受 jpeg、jpg，png 的圖片檔案'), false);
    } else {
      // ? 圖片過濾沒問題
      cb(null, true);
    }
  },
  // 過濾檔案的大小
  limits: {
    // ? 單位為 byte
    fileSize: 2000 * 1024,
  },
});

router.get('/', authMiddleware.authVerify, adminController.userGetProfile);
router.post('/edit/social_name', authMiddleware.authVerify, adminController.userEditSocialName);
router.post('/edit/name', authMiddleware.authVerify, adminController.userEditName);
router.post('/edit/phone', authMiddleware.authVerify, adminController.userEditPhone);
router.post('/edit/gender', authMiddleware.authVerify, adminController.userEditGender);
router.post('/edit/photo', uploader.single('photo'), authMiddleware.authVerify, adminController.userEditPhoto);
router.post('/edit/password', authMiddleware.authVerify, authMiddleware.resetPasswordRules, adminController.userEditPassword);
router.post('/password', authMiddleware.authVerify, authMiddleware.resetPasswordRules, adminController.userCreatePassword);
router.post('/reset/password', authMiddleware.resetPasswordRules, adminController.userResetPassword);
router.get('/voucher', authMiddleware.authVerify, adminController.userReadVouchers);
router.get('/voucher/exchange/:productId', authMiddleware.authVerify, adminController.userGetVouchersId);
router.get('/order', authMiddleware.authVerify, adminController.userGetOrderInfo);
router.post('/score/:productId', authMiddleware.authVerify, adminController.userPostScore);
router.get('/collection', authMiddleware.authVerify, adminController.userGetCollectionInfo);
router.get('/conversation', authMiddleware.authVerify, adminController.userGetConversationList);
router.post('/conversation/:storeId', authMiddleware.authVerify, adminController.userCreateConversation);
router.get('/conversation/product/:storeId', adminController.userGetConversationProduct);
router.post('/conversation/text/:id', authMiddleware.authVerify, adminController.userPostTextMessage);
router.post('/conversation/sticker/:id', authMiddleware.authVerify, adminController.userPostStickerMessage);
router.post('/conversation/product/:id', authMiddleware.authVerify, adminController.userPostProductMessage);
router.post('/conversation/photo/:id', messageImgUploader.single('photo'), authMiddleware.authVerify, adminController.userPostPhotoMessage);

module.exports = router;
