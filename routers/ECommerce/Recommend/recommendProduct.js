const express = require('express');
const router = express();
const pool = require('../../../utils/db');

// ---- /api/1.0/product/recommendProduct
router.get('/recommendProduct', async (req, res) => {
  // console.log(req.query);
  // console.log('====================================');
  try {
    const [product] = await pool.execute(
      `SELECT id, product_type_id,name, description, price, per_score,photo_path,main_photo FROM product WHERE product_type_id = ${req.query.typeId} And product_tag LIKE '%${req.query.keyword}%'`
    );
    // console.log(product);
    res.json(product);
  } catch (error) {
    console.error(error);
  }
});

// ---- /api/1.0/product/recommendProduct
router.get('/recommendProduct/news', async (req, res) => {
  // console.log(req.query);
  // const typeId= req.query.typeId
  // const keyword = req.query.keyword
  const typeId = 2;
  const keyword = '戶外活動';
  // console.log('====================================');
  try {
    const [product] = await pool.execute(
      `SELECT name, price, per_score, photo_path,main_photo FROM product WHERE product_type_id = ${typeId} And product_tag LIKE '%${keyword}%' LIMIT 3`
    );
    // console.log(product);
    res.json(product);
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
