const express = require('express');
const router = express();
const pool = require('../../../utils/db');

router.post('/cart:productId', async (req, res) => {
  // console.log('----------req.body.orderBuying-----------', req.body.orderBuying);
  const productId = req.params.productId;

  result = await pool.execute(`DELETE FROM cart WHERE  product_id = ?`, [productId]);
  console.log('-----DELETE-STATUS-----');
  console.log('商品編號:', productId, '購物車已成功移除！');
});

module.exports = router;
