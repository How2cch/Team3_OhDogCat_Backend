const express = require('express');
const router = express();
const pool = require('../../../utils/db');

// ---- /api/1.0/product//recommendProduct
router.get('/recommendProduct', async (req, res) => {
  try {
    const [product] = await pool.execute(
      // `SELECT id, product_type_id,name, description, price, per_score,photo_path,main_photo FROM product WHERE product_type_id = ${req.query.typeId} And description LIKE '%${req.query.keyword}%'`
      `SELECT * FROM cart WHERE product_id=519`
    );
    // console.log(product);
    res.json(product);
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
