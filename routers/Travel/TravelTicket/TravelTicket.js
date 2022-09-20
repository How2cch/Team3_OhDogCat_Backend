const express = require('express');
const router = express();
const pool = require('../../../utils/db');

router.get('/travelTicket/title', async (req, res) => {
  let [result] = await pool.execute(
    'SELECT id, product_type_id, name,description ,price,photo_path,main_photo FROM product WHERE store_id = ?',
    [20]
  );
  // console.log('result', result);
  res.json(result);
});

module.exports = router;
