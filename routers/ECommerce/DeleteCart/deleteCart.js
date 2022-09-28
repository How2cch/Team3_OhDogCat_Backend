const express = require('express');
const router = express();
const pool = require('../../../utils/db');

router.post('/cart:productId', async (req, res) => {
  // console.log('----------req.body.orderBuying-----------', req.body.orderBuying);
  const productId = req.params.productId;
  // console.log('-----productId-----', productId);

  result = await pool.execute(
    `DELETE FROM cart WHERE  product_id = ?`,
    [productId]
  );
});

module.exports = router;