const { body } = require('express-validator');

const registerRules = [
  body('email').isEmail().withMessage('Email 欄位格式錯誤'),
  body('password')
    .isLength({ min: 8, max: 20 })
    .withMessage('密碼長度需 8 ~ 20 字元')
    .matches(/^[A-Za-z0-9]+$/)
    .withMessage('密碼只能含有大小寫英文字母與數字'),
  body('confirmPassword')
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage('兩次密碼輸入不一致'),
];
const loginRules = [body('email').isEmail().withMessage('Email 格式錯誤'), body('password').isLength({ min: 8 }).withMessage('密碼格式錯誤')];

const resetPasswordRules = [
  body('password')
    .isLength({ min: 8, max: 20 })
    .withMessage('密碼長度需 8 ~ 20 字元')
    .matches(/^[A-Za-z0-9]+$/)
    .withMessage('密碼只能含有大小寫英文字母與數字'),
  body('confirmPassword')
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage('兩次密碼輸入不一致'),
];

const authVerify = (req, res, next) => {
  console.log('=== 用戶狀態驗證 ===', req.session.user?.id);
  if (!req.session.user) return res.status(401).json({ login: false, message: '無登入權限' });
  next();
};

module.exports = { registerRules, loginRules, resetPasswordRules, authVerify };
