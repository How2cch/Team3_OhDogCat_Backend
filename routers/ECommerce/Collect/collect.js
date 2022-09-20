const express = require('express');
const router = express();
const pool = require('../../../utils/db');

const authMiddleware = require('../../../middlewares/userAuth');

//  /api/1.0/collect
// TODO記得驗證登入
router.post(
  '/product/:productId',
  // authMiddleware.authVerify,
  async (req, res) => {
    console.log(req.param('productId'));
    try {
      // const [collectData] = await pool.execute(
      //   `SELECT * FROM favorite WHERE product_id =?`,
      //   [productId]
      // );
      // console.log(product);
      res.json(product);
    } catch (error) {
      console.error(error);
    }
  }
);

module.exports = router;
