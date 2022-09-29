const express = require('express');
const router = express();
const pool = require('../../../utils/db');

router.post('/order', async (req, res) => {
  const orderBuying = req.body.orderBuying;
  console.log(`-----用戶:${orderBuying.user_id}商品編號:${orderBuying.product_id}的訂單已新增資料庫!-----`);
  console.log(orderBuying);

    result = await pool.execute(
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
});

module.exports = router;
