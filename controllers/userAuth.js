const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const authModel = require('../models/userAuth');
const axios = require('axios');
const Qs = require('qs');
const jwtDecode = require('jwt-decode');
const moment = require('moment');

const userRegister = async (req, res) => {
  console.log('session ====================', req.session);
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
    const existUser = await authModel.isAccountExist(req.body);
    if (existUser.length > 0) {
      console.log('existUser', existUser);
      const emailError = { param: 'email', value: req.body.socialName, msg: '這個 Email 已被註冊', location: 'body' };
      const socialNameError = { param: 'socialName', value: req.body.socialName, msg: '這個暱稱已被使用', location: 'body' };
      if (existUser[0].email === req.body.email && existUser[0].social_name === req.body.socialName)
        return res.status(400).json({ message: '註冊失敗', error: [emailError, socialNameError] });
      if (existUser[0].email === req.body.email) return res.status(400).json({ message: '註冊失敗', error: [emailError] });
      if (existUser[0].social_name === req.body.socialName) return res.status(400).json({ message: '註冊失敗', error: [socialNameError] });
    }

    // = 將密碼雜湊，並整理 user insert info
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    console.log('雜湊密碼', hashPassword);
    const now = moment().format('YYYY-MM-DD hh:mm:ss');
    const insertInfo = { email: req.body.email, password: hashPassword, social_name: req.body.socialName, photo: '', create_time: now };

    // = 寫進資料庫，回傳結果給前端
    const result = await authModel.insertUser(insertInfo);
    const registerUser = {
      id: result.insertId,
      socialName: req.body.socialName,
      email: req.body.email,
      photo: '',
      name: '',
      loginDt: now,
    };
    console.log('user register success');
    req.session.user = registerUser;
    // console.log('session ====================', req.session);

    res.status(201).json({ status: 'ok', message: '註冊成功', user: registerUser });
  } catch (error) {
    res.status(500).json({ message: '異常，請洽系統管理員' });
    throw new Error(error);
  }
};

const userLogin = async (req, res) => {
  console.log('session ====================', req.session);
  console.log('register request', req.body);
  const validation = validationResult(req);

  // = 如果有任一驗證出現 Error 紀錄，則中斷，返回前端驗證結果
  if (validation.array().length > 0) {
    console.log('error', validation.array());
    return res.status(401).json({ status: 'failed', message: '帳號或密碼錯誤' });
  }

  try {
    // = 進資料庫驗證信箱搜尋是否有匹配的資料
    const [existUser] = await authModel.isLoginUserExist(req.body);
    console.log('existUser', existUser ? existUser : '沒有這個 user');
    if (!existUser) return res.status(401).json({ status: 'failed', message: '帳號或密碼錯誤' });

    // = 比較密碼是否正確
    let checkPassword = await bcrypt.compare(req.body.password, existUser.password);
    console.log(checkPassword);
    if (!checkPassword) return res.status(401).json({ status: 'failed', message: '帳號或密碼錯誤' });

    // = 寫進 Session 回給前端
    const loginUser = {
      id: existUser.id,
      name: existUser.name,
      email: existUser.email,
      social_name: existUser.social_name,
      photo: existUser.photo,
      loginDt: moment().format('YYYY-MM-DD hh:mm:ss'),
    };
    req.session.user = loginUser;
    console.log('session ====================', req.session);

    res.status(200).json({ status: 'ok', message: '登入成功', user: loginUser });
  } catch (error) {
    res.status(500).json({ message: '異常，請洽系統管理員' });
    throw new Error(error);
  }
};

const userLineRegister = async (req, res) => {
  if (!req.query.code) return res.redirect(`http://localhost:3000?line_login=false`);
  res.redirect(`http://localhost:3000?line_login=true&code=${req.query.code}&state=${req.query.state}`);
};

const userLineLogin = async (req, res) => {
  console.log('session ====================', req.session);
  console.log('用戶嘗試使用 LINE 登入');

  // = line token API config
  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };
  // = line token API requestBody
  const requestBody = {
    grant_type: 'authorization_code',
    code: req.body.code,
    redirect_uri: req.body.redirect_uri,
    client_id: 1657462251,
    client_secret: '6f3254d1a62c5cbb25df7ed341c1d1b2',
  };

  try {
    // = 跟 line 換取用戶 token
    const tokenResult = await axios.post('https://api.line.me/oauth2/v2.1/token', Qs.stringify(requestBody), config);
    console.log('tokenResult data=', tokenResult);
    // = 解析 token
    const { picture, email } = jwtDecode(tokenResult.data.id_token);
    console.log('info=', picture, email);

    // = 檢視 User 是否存在
    const [existUser] = await authModel.isLoginUserExist({ email: email });
    console.log('existUser=', existUser);
    // = 若 User 不存在，新增使用者，若已存在則讓 User 直接登入
    const isExist = existUser ? existUser.email === email : false;
    console.log('isExist=', isExist);
    const now = moment().format('YYYY-MM-DD hh:mm:ss');
    const insertInfo = { email: email, social_name: '', password: '', photo: picture, create_time: now };
    console.log('insertInfo=', insertInfo);
    const insertResult = isExist ? false : await authModel.insertUser(insertInfo);
    console.log(isExist ? '該信箱已有註冊紀錄' : '用戶成功使用 line 註冊');
    console.log('insertResult=', insertResult);

    // = 將用戶資料寫進 Session
    const loginUser = {
      id: isExist ? existUser.id : insertResult.insertId,
      name: isExist ? existUser.name : '',
      email: email,
      social_name: isExist ? existUser.social_name : '',
      photo: isExist && existUser.photo[0] === '/' ? existUser.photo : picture,
      loginDt: now,
    };
    console.log('loginUser=', loginUser);
    req.session.user = loginUser;
    console.log('session ====================', req.session);
    res.status(200).json({ status: 'ok', message: '登入成功', user: loginUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '異常，請洽系統管理員', error: error });
  }
};

const userLogout = async (req, res) => {
  console.log('session ====================', req.session);
  req.session.user = null;
  console.log('session ====================', req.session);
  res.status(201).json({ status: 'ok', message: '登出成功' });
};

const userVerifyStatus = async (req, res) => {
  console.log('初次驗證 sess id', req.sessionID);
  console.log('session ====================', req.session);
  console.log('用戶進行登入驗證');
  if (!req.session.user) {
    console.log('用戶無登入權限');
    return res.status(200).json({ status: 'ok', isLogin: false, message: '此用戶無登入權限' });
  } else {
    console.log('用戶登入驗證成功');
    return res.status(200).json({ status: 'ok', isLogin: true, message: '此用戶處於登入狀態', user: req.session.user });
  }
};

module.exports = { userRegister, userLogin, userLogout, userVerifyStatus, userLineLogin, userLineRegister };
