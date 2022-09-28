const express = require('express');
const router = express();
const pool = require('../../../utils/db');

const authMiddleware = require('../../../middlewares/userAuth');

//  /api/1.0/cart/postmore
// TODO記得驗證登入
// authMiddleware.authVerify,
// /:productId
router.post(
  '/postmore/:productId',
  authMiddleware.authVerify,
  async (req, res) => {
    const user_id = req.session.user.id;
    const product_id = req.params.productId;
    // const user_id = 1;
    // const product_id = 520;
    try {
      // 辨認購物車資料庫裡面有沒有相同的商品
      const [isExist] = await pool.execute(
        `SELECT * FROM cart WHERE user_id=? AND product_id = ? `,
        [user_id, product_id]
      );
      // 加入購物車
      if (!isExist[0]) {
        console.log('新增');
        result = await pool.execute(
          `INSERT INTO cart (user_id, product_id, quantity) VALUE (?,?,1)`,
          [user_id, product_id]
        );
      } else {
        console.log('加一');
        result = await pool.execute(
          `UPDATE cart SET quantity=quantity+1 WHERE user_id=? AND product_id =? `,
          [user_id, product_id]
        );
      }
      res.send(
        isExist[0] ? { message: '+1' } : { message: '加入購物車' }
        // { message: '已成功加入購物車' }
      );
    } catch (error) {
      console.error(error);
    }
  }
);

module.exports = router;
