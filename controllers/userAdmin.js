const adminModel = require('../models/userAdmin');
// const bcrypt = require('bcrypt');
// const { validationResult } = require('express-validator');
// const axios = require('axios');
// const Qs = require('qs');
// const jwtDecode = require('jwt-decode');
// const moment = require('moment');

const userEditSocialName = async (req, res) => {
  console.log('session ====================', req.session);
  if (req.body.socialName.length > 20 || /\s/.test(req.body.socialName)) {
    return res
      .status(400)
      .json({ message: '無法使用', error: { param: 'socialName', value: req.body.socialName, msg: '暱稱不可包含空格且長度不得超過 20 個字', location: 'body' } });
  }
  const isExist = await adminModel.isSocialNameExist(req.body.socialName);
  if (isExist[0]) {
    return res.status(400).json({ message: '無法使用', error: { param: 'socialName', value: req.body.socialName, msg: '此暱稱已被使用', location: 'body' } });
  }
  await adminModel.updateSocialName(req.session.user.id, req.body.socialName);
  req.session.user.social_name = req.body.socialName;
  console.log('session ====================', req.session);
  res.status(201).json({ status: 'ok', message: '修改成功', user: req.session.user });
};

module.exports = { userEditSocialName };
