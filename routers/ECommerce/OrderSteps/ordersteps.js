const express = require('express');
const router = express();
const pool = require('../../../utils/db');

const authMiddleware = require('../../../middlewares/userAuth');

//  /api/1.0/cart/postCart
// TODO記得驗證登入
// authMiddleware.authVerify,
router.get('/coupon', async (req, res) => {
  // const user_id = req.session.user.id;
  // const product_id = req.params.productId;
  // const product_id = 519;
  // console.log('user', user_id);
  try {
    // const [isExist] = await pool.execute(
    //   `SELECT * FROM cart WHERE product_id = ? `,
    //   [product_id]
    // );
    const [couponData] = await pool.execute(`SELECT id , name, quantity, description FROM coupon;`);
    console.log(couponData);
    // let result;
    // if (!isExist[0]) {
    //   console.log('新增');
    //   result = await pool.execute(
    //     `INSERT INTO favorite (product_id, user_id) VALUE (?, ?)`,
    //     [product_id, user_id]
    //   );
    // } else {
    //   console.log('刪除');
    //   result = await pool.execute(
    //     `DELETE FROM favorite WHERE  product_id = ? AND user_id = ?`,
    //     [product_id, user_id]
    //   );
    // }
    res.json(
      couponData
      // isExist[0] ? { message: '已成功移除收藏' } : { message: '已成功收藏' }
    );
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
