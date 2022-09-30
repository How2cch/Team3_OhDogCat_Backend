const express = require('express');
const pool = require('../utils/db');
const router = express();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const moment = require('moment');
const sendMail = require('../mail_voucher_exchenge');

router.use(bodyParser.urlencoded());

router.get('/exchange/:exchangeId', async (req, res) => {
  try {
    const [productResult] = await pool.execute(
      'SELECT v.quantity, p.photo_path, p.main_photo, p.name, p.store_id FROM voucher_exchange AS v JOIN product AS p ON v.product_id = p.id WHERE v.id = ? AND v.status = 1 AND expired_time >= ?',
      [req.params.exchangeId, moment().format('YYYY-MM-DD HH:mm;ss')]
    );
    console.log(productResult);
    if (productResult.length === 0) return res.render('store_voucher_exchange--result', { text: '該核銷代碼已失效，請重新兌換' });
    const [staffResult] = await pool.execute('SELECT id, name FROM store_staff WHERE store_id = ?', [productResult[0].store_id]);
    const data = {
      submit_url: process.env.OPEN_URL + '/store/voucher/exchange',
      quantity: productResult[0].quantity,
      img: `${process.env.OPEN_URL}${productResult[0].photo_path}/${productResult[0].main_photo}`,
      name: productResult[0].name,
      store_id: productResult[0].store_id,
      staff: staffResult,
      exchange_id: req.params.exchangeId,
    };
    res.render('store_voucher_exchange', data);
  } catch (error) {
    console.error(error);
    res.render('store_voucher_exchange--result', { text: '系統異常，請洽平台管理員' });
  }
});

router.post('/exchange', async (req, res) => {
  try {
    console.log(req.body);
    const now = moment();
    // = 確認核銷行為是合法對象所為
    console.log('staff id = ' + req.body.staff_id + ' 正在核銷');
    const [staffVerify] = await pool.execute('SELECT name, password FROM store_staff WHERE id =?', [req.body.staff_id]);
    let checkPassword = await bcrypt.compare(req.body.staff_password, staffVerify[0].password);
    console.log('staff 密碼審核', checkPassword);
    if (!checkPassword) return res.render('store_voucher_exchange--result', { text: '核銷失敗，請確認核銷人員密碼' });

    // = 確認核銷內容合法
    const [voucherResult] = await pool.execute(
      'SELECT s.name AS store_name, e.user_id, u.name AS user_name,  u.email AS user_email, v.product_id, p.name AS product_name, e.quantity AS exchange_quantity, v.quantity AS quantity, expired_time, status FROM (((voucher_exchange AS e JOIN voucher AS v ON (e.user_id = v.user_id AND e.product_id = v.product_id)) JOIN user AS u ON e.user_id = u.id) JOIN product AS p ON e.product_id = p.id ) JOIN store AS s ON p.store_id = s.id WHERE e.id = ?',
      [req.body.exchange_id]
    );

    const { store_name, user_id, user_name, user_email, product_id, product_name, exchange_quantity, quantity, expired_time, status } = voucherResult[0];
    console.log('檢查時間合法');
    if (now.isAfter(expired_time)) return res.render('store_voucher_exchange--result', { text: '核銷失敗，已逾時，請重新兌換' });
    console.log('檢查兌換庫存足夠');
    if (quantity < exchange_quantity) return res.render('store_voucher_exchange--result', { text: '核銷失敗，可兌換數量不足' });
    console.log('檢查兌換憑證合法');
    if (status === 0) return res.render('store_voucher_exchange--result', { text: '核銷失敗，兌換憑證已失效' });
    // = 核銷內容無誤，更新資料庫
    await pool.execute('UPDATE voucher_exchange SET status = 0 , exchange_time = ?, exchange_staff = ? WHERE id = ?', [
      now.format('YYYY-MM-DD HH:mm:ss'),
      req.body.staff_id,
      req.body.exchange_id,
    ]);
    console.log('該票券剩餘', quantity);
    console.log('本次使用', exchange_quantity);
    await pool.execute('UPDATE voucher SET quantity = ? WHERE user_id = ? AND product_id = ?', [quantity - exchange_quantity, user_id, product_id]);
    const mainInfo = {
      address: user_email,
      userName: user_name,
      exchangeQuantity: exchange_quantity,
      productName: product_name,
      staffId: req.body.staff_id,
      exchangeTime: now.format('YYYY-MM-DD HH:mm:ss'),
      storeName: store_name,
    };
    sendMail(mainInfo);
    res.render('store_voucher_exchange--result', { text: '核銷成功！' });
  } catch (error) {
    console.error(error);
    res.render('store_voucher_exchange--result', { text: '系統異常，請洽平台管理員' });
  }
});
module.exports = router;
