const express = require('express');
const router = express();
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const { registerFormatRules } = require('../middlewares/userAuth.js');
const pool = require('../utils/db');
const path = require('path');

router.post('/register', registerFormatRules, async (req, res) => {
  console.log('register request', req.body);

  // = 將驗證結果取出，並將客製化的驗證結果與前面的驗證結果合併
  const validation = validationResult(req);
  let error = validation.array();
  if (req.body.socialName.length > 20 || /\s/.test(req.body.socialName)) {
    error.push({ param: 'socialName', value: req.body.socialName, msg: '暱稱不可包含空格且長度不得超過 20 個字', location: 'body' });
  }

  // = 如果有任一驗證出現 Error 紀錄，則中斷，返回前端驗證結果
  if (error[0]) {
    console.log('error', error);
    return res.status(400).json({ message: '格式錯誤', error: error });
  }
  console.log('register 格式無誤');

  try {
    // = 進資料庫驗證信箱 or 暱稱是否已被註冊過，如果有則返回前端已被註冊的欄位是那些
    let [user] = await pool.execute('SELECT email, social_name FROM user WHERE email = ? OR social_name = ?', [req.body.email, req.body.socialName]);
    if (user[0]) {
      console.log('user', user);
      const emailError = { param: 'email', value: req.body.socialName, msg: '這個 Email 已被註冊', location: 'body' };
      const socialNameError = { param: 'socialName', value: req.body.socialName, msg: '這個暱稱已被使用', location: 'body' };
      if (user[0].email === req.body.email && user[0].social_name === req.body.socialName)
        return res.status(400).json({ message: '註冊失敗', error: [emailError, socialNameError] });
      if (user[0].email === req.body.email) return res.status(400).json({ message: '註冊失敗', error: [emailError] });
      if (user[0].social_name === req.body.socialName) return res.status(400).json({ message: '註冊失敗', error: [socialNameError] });
    }

    // = 將密碼雜湊
    let hashPassword = await bcrypt.hash(req.body.password, 10);
    console.log('雜湊密碼', hashPassword);

    // = 寫進資料庫，回傳結果給前端
    let [result] = await pool.execute('INSERT INTO user (email, password, social_name) VALUE (?, ?, ?)', [req.body.email, hashPassword, req.body.socialName]);
    const registerUser = {
      id: result.id,
      socialName: req.body.socialName,
      email: req.body.email,
      loginDt: new Date().toISOString(),
    };
    res.json({ status: 'ok', message: '註冊成功', user: registerUser });
  } catch (error) {
    res.status(500).json({ message: '異常，請洽系統管理員' });
    throw new Error(error);
  }
});

module.exports = router;
