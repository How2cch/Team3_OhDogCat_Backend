const { body } = require('express-validator');

const registerRules = [
  body('email').isEmail().withMessage('Email 欄位格式錯誤'),
  body('password').isLength({ min: 8 }).withMessage('密碼長度需要至少為 8'),
  body('confirmPassword')
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage('兩次密碼輸入不一致'),
];
const loginRules = [body('email').isEmail().withMessage('Email 格式錯誤'), body('password').isLength({ min: 8 }).withMessage('密碼格式錯誤')];

const authVerify = (req, res, next) => {
  console.log('===嘿嘿===', req.session);
  if (!req.session.user) return res.status(401).json({ login: false, message: '無登入權限' });
  next();
};

module.exports = { registerRules, loginRules, authVerify };
