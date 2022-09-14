const { body } = require('express-validator');

const registerFormatRules = [
  body('email').isEmail().withMessage('Email 欄位格式錯誤'),
  body('password').isLength({ min: 8 }).withMessage('密碼長度需要至少為 8'),
  body('confirmPassword')
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage('兩次密碼輸入不一致'),
];

const loginFormatRules = [body('email').isEmail().withMessage('Email 欄位格式錯誤'), body('password').isLength({ min: 8 }).withMessage('密碼長度需要至少為 8')];

module.exports = { registerFormatRules, loginFormatRules };
