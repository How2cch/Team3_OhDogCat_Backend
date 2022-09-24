const adminModel = require('../models/userAdmin');
const pool = require('../utils/db');
const moment = require('moment');
const { v4: uuidv4 } = require('uuid');
// const bcrypt = require('bcrypt');
// const { validationResult } = require('express-validator');
// const axios = require('axios');
// const Qs = require('qs');
// const jwtDecode = require('jwt-decode');

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

const userReadVouchers = async (req, res) => {
  console.log('session ====================', req.session);
  console.log('用戶id' + req.session.user.id + '檢視 Voucher');
  try {
    const data = await adminModel.getUserVoucher(req.session.user.id);
    let result = [];
    data.forEach((item) => {
      const { product_id } = item;
      if (result.length === 0 || product_id !== result[result.length - 1].product_id) return result.push({ ...item, photos: [item.photos] });
      result[result.length - 1].photos.push(item.photos);
    });
    console.log('用戶id' + req.session.user.id + '檢視 Voucher 成功，共 ' + result.length + ' 筆');

    res.status(200).json({ status: 'ok', data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '異常，請洽系統管理員', error: error });
  }
};

const userGetVouchersId = async (req, res) => {
  console.log('session ====================', req.session);
  console.log('用戶id' + req.session.user.id + '欲取得 Voucher 核銷 id');

  try {
    // = 檢查該用戶票券剩餘數量足夠以及兌換時間有效
    let [isEnough] = await pool.execute(
      'SELECT v.quantity, p.valid_time_start, p.valid_time_end FROM voucher AS v JOIN product AS p ON v.product_id = p.id WHERE user_id = ? AND product_id = ? ',
      [req.session.user.id, req.params.productId]
    );
    console.log('用戶票券庫存', isEnough.length > 0);

    if (isEnough.length > 0) {
      const v_time_end = isEnough[0].valid_time_end ? isEnough[0].valid_time_end : '9999-12-31';
      const v_time_start = isEnough[0].valid_time_start ? isEnough[0].valid_time_start : '1900-01-01';

      console.log('時間合法', moment().isBefore(v_time_end) && moment(v_time_start).isBefore(moment()));
      console.log('數量合法', Number(isEnough[0].quantity) >= Number(req.query.quantity));

      isEnough = moment().isBefore(v_time_end) && moment(v_time_start).isBefore(moment()) && Number(isEnough[0].quantity) >= Number(req.query.quantity);
    } else {
      return res.status(400).json({ message: '無法使用', error: { msg: '請確認使用時間或兌換數量' } });
    }

    if (!isEnough) return res.status(400).json({ message: '無法使用', error: { msg: '請確認使用時間或兌換數量' } });

    // = 搜尋核銷列表是否有可用合法資料
    const [isExist] = await pool.execute('SELECT * FROM voucher_exchange WHERE user_id = ? AND product_id = ? AND status = 1 AND expired_time between NOW() and ?;', [
      req.session.user.id,
      req.params.productId,
      moment().add(5, 'minute').format('YYYY-MM-DD HH:mm:ss'),
    ]);
    console.log('有登記核銷紀錄', isExist.length > 0);

    const now = moment();
    const isValid = isExist.length > 0 && moment(now).isBefore(isExist[0].expired_time);
    console.log('是否有可用記錄', isValid);
    const newExpire = moment().add(5, 'minute').format('YYYY-MM-DD HH:mm:ss');
    if (isExist.length !== 0 && isValid) {
      await pool.execute('UPDATE voucher_exchange SET expired_time = ? ,quantity = ?  WHERE id = ?', [newExpire, req.query.quantity, isExist[0].id]);
      return res.status(200).json({ status: 'ok', data: { id: isExist[0].id, path: `/store/voucher/exchange/${isExist[0].id}` } });
    }
    console.log('創建新核銷 id');
    const uuid = uuidv4();
    await pool.execute(`INSERT INTO voucher_exchange (id , user_id, product_id, quantity, expired_time) VALUES (?,?,?,?,?)`, [
      uuid,
      req.session.user.id,
      req.params.productId,
      Number(req.query.quantity),
      newExpire,
    ]);
    res.status(200).json({ status: 'ok', data: { id: uuid, path: `/store/voucher/exchange/${uuid}` } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '異常，請洽系統管理員', error: error });
  }
};

module.exports = { userEditSocialName, userReadVouchers, userGetVouchersId };
