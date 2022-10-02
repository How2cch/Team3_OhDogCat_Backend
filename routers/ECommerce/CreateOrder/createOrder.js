const express = require('express');
const router = express();
const pool = require('../../../utils/db');
const sendMail = require('../../../mail_order_create');

router.post('/order', async (req, res) => {
  try {
    const orderBuying = req.body.orderBuying;
    console.log(`-----用戶:${orderBuying.user_id}商品編號:${orderBuying.product_id}的訂單已新增資料庫!-----`);
    console.log(orderBuying);

    await pool.execute(
      `INSERT INTO order_buying (user_id,product_id, product_quantity, product_price, order_no, total, pay, coupon_number, coupon_name
  , order_time) VALUE (?, ?,?,?,?,?,?,?,?,?)`,
      [
        orderBuying.user_id,
        orderBuying.product_id,
        orderBuying.product_quantity,
        orderBuying.product_price,
        orderBuying.order_no,
        orderBuying.total,
        orderBuying.pay,
        orderBuying.coupon_number,
        orderBuying.coupon_name,
        orderBuying.order_time,
      ]
    );

    const [result] = await pool.execute('SELECT quantity FROM voucher WHERE user_id = ? AND product_id = ?', [req.session.user.id, orderBuying.product_id]);
    // TODO: 獲取需要的資訊 from 資料庫
    const mailData = {
      address: req.session.user.email,
      user_name: req.session.user.name,
      product_name: '貓砂盆',
      product_quantity: orderBuying.product_quantity,
      payment_type: orderBuying.pay,
      store_name: '測試店家',
      total: orderBuying.total,
    };
    if (result.length === 0) {
      // = voucher add
      await pool.execute(`INSERT INTO voucher (user_id,product_id, quantity) VALUE (?, ?,?)`, [orderBuying.user_id, orderBuying.product_id, orderBuying.product_quantity]);
      sendMail(mailData);
      return res.status(201).json({ status: 'ok', message: '成功建立訂單' });
    } else {
      await pool.execute(`UPDATE voucher SET quantity=? WHERE user_id = ? AND product_id = ?`, [
        result[0]['quantity'] + orderBuying.product_quantity,
        orderBuying.user_id,
        orderBuying.product_id,
      ]);
      sendMail(mailData);

      return res.status(201).json({ status: 'ok', message: '成功建立訂單' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: '系統異常', error: error });
  }
});

module.exports = router;
