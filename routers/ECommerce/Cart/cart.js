const express = require('express');
const router = express();
const pool = require('../../../utils/db');

const authMiddleware = require('../../../middlewares/userAuth');

//  /api/1.0/cart/postmore
// TODO記得驗證登入
// authMiddleware.authVerify,
// /:productId

// ================側邊購物車用==================

router.post('/postmore/:productId', authMiddleware.authVerify, async (req, res) => {
  const user_id = req.session.user.id;
  const product_id = req.params.productId;
  // const user_id = 1;
  // const product_id = 520;
  try {
    // 辨認購物車資料庫裡面有沒有相同的商品
    const [isExist] = await pool.execute(`SELECT * FROM cart WHERE user_id=? AND product_id = ? `, [user_id, product_id]);
    // 加入購物車
    let result;
    if (!isExist[0]) {
      console.log('新增');
      result = await pool.execute(`INSERT INTO cart (user_id, product_id, quantity) VALUE (?,?,1)`, [user_id, product_id]);
    } else {
      console.log('加一');
      result = await pool.execute(`UPDATE cart SET quantity=quantity+1 WHERE user_id=? AND product_id =? `, [user_id, product_id]);
    }
    const isAdd = await pool.execute(
      'SELECT `cart`.`user_id`,`cart`.`product_id`, `cart`.`quantity`, `product`.`name`, `product`.`price`, `product`.`main_photo`, `product`.`photo_path` FROM `cart` JOIN `product` ON `cart`.`product_id` = `product`.`id` WHERE cart.user_id=?',
      [user_id]
    );
    // res.send(
    //   isExist[0] ? { message: '+1' } : { message: '加入購物車' }
    //   // { message: '已成功加入購物車' }
    // );
    res.json(isAdd);
  } catch (error) {
    console.error(error);
  }
});

//  /api/1.0/cart/postreduce
router.post('/postreduce/:productId', authMiddleware.authVerify, async (req, res) => {
  const user_id = req.session.user.id;
  const product_id = req.params.productId;
  // const user_id = 1;
  // const product_id = 520;
  // console.log('req.body', req.body);
  try {
    // 辨認購物車資料庫裡面有沒有相同的商品
    const [isExist] = await pool.execute(`SELECT * FROM cart WHERE user_id=? AND product_id = ?`, [user_id, product_id]);
    const quantityNum = isExist[0]['quantity'];
    // console.log(isExist[0]);
    // console.log(quantityNum);
    // 加入購物車
    let result;
    if (isExist[0] && quantityNum > 1) {
      console.log('減一');
      result = await pool.execute(`UPDATE cart SET quantity=quantity-1 WHERE user_id=? AND product_id =? `, [user_id, product_id]);
    } else {
      console.log('刪除');
      result = await pool.execute(` DELETE FROM cart WHERE user_id=? AND product_id =? `, [user_id, product_id]);
    }
    const isMinus = await pool.execute(
      'SELECT `cart`.`user_id`,`cart`.`product_id`, `cart`.`quantity`, `product`.`name`, `product`.`price`, `product`.`main_photo`, `product`.`photo_path` FROM `cart` JOIN `product` ON `cart`.`product_id` = `product`.`id` WHERE cart.user_id=?',
      [user_id]
    );
    // res.send(
    //   quantityNum > 1 ? { message: '-1' } : { message: '刪除' }
    //   // { message: '已成功加入購物車' }
    // );
    res.json(isMinus);
    console.log(isMinus);
  } catch (error) {
    console.error(error);
  }
});

// ================購物三步驟用==================

router.post('/orderpostmore/:productId', authMiddleware.authVerify, async (req, res) => {
  const user_id = req.session.user.id;
  const product_id = req.params.productId;
  // const user_id = 1;
  // const product_id = 520;
  try {
    // 辨認購物車資料庫裡面有沒有相同的商品
    const [isExist] = await pool.execute(`SELECT * FROM cart WHERE user_id=? AND product_id = ? `, [user_id, product_id]);
    // 加入購物車
    let result;
    if (!isExist[0]) {
      console.log('新增');
      result = await pool.execute(`INSERT INTO cart (user_id, product_id, quantity) VALUE (?,?,1)`, [user_id, product_id]);
    } else {
      console.log('加一');
      result = await pool.execute(`UPDATE cart SET quantity=quantity+1 WHERE user_id=? AND product_id =? `, [user_id, product_id]);
    }
    const isAdd = await pool.execute(
      'SELECT `cart`.`user_id`,`cart`.`product_id`, `cart`.`quantity`, `product`.`name`, `product`.`price`, `product`.`main_photo`, `product`.`photo_path` FROM `cart` JOIN `product` ON `cart`.`product_id` = `product`.`id` WHERE `cart`.`product_id` = ?',
      [product_id]
    );
    // res.send(
    //   isExist[0] ? { message: '+1' } : { message: '加入購物車' }
    //   // { message: '已成功加入購物車' }
    // );
    res.json(isAdd);
    console.log(isAdd[0]);
  } catch (error) {
    console.error(error);
  }
});
router.post('/orderpostreduce/:productId', authMiddleware.authVerify, async (req, res) => {
  const user_id = req.session.user.id;
  const product_id = req.params.productId;
  // const user_id = 1;
  // const product_id = 520;
  // console.log('req.body', req.body);
  try {
    // 辨認購物車資料庫裡面有沒有相同的商品
    const [isExist] = await pool.execute(`SELECT * FROM cart WHERE user_id=? AND product_id = ?`, [user_id, product_id]);
    const quantityNum = isExist[0]['quantity'];
    // console.log(isExist[0]);
    // console.log(quantityNum);
    // 加入購物車
    if (isExist[0] && quantityNum > 1) {
      console.log('減一');
      result = await pool.execute(`UPDATE cart SET quantity=quantity-1 WHERE user_id=? AND product_id =? `, [user_id, product_id]);
    } else {
      console.log('刪除');
      // result = await pool.execute(` DELETE FROM cart WHERE user_id=? AND product_id =? `, [user_id, product_id]);
    }
    const isMinus = await pool.execute(
      'SELECT `cart`.`user_id`,`cart`.`product_id`, `cart`.`quantity`, `product`.`name`, `product`.`price`, `product`.`main_photo`, `product`.`photo_path` FROM `cart` JOIN `product` ON `cart`.`product_id` = `product`.`id` WHERE `cart`.`product_id` = ?',
      [product_id]
    );
    // res.send(
    //   quantityNum > 1 ? { message: '-1' } : { message: '刪除' }
    //   // { message: '已成功加入購物車' }
    // );
    res.json(isMinus);
    console.log(isMinus);
  } catch (error) {
    console.error(error);
  }
});

// TODO:登入驗證？
router.get('/list', authMiddleware.authVerify, async (req, res) => {
  // console.log(req.query);
  try {
    const [list] = await pool.execute(
      'SELECT `cart`.`user_id`,`cart`.`product_id`, `cart`.`quantity`, `product`.`name`, `product`.`price`, `product`.`main_photo`, `product`.`photo_path` FROM `cart` JOIN `product` ON `cart`.`product_id` = `product`.`id` WHERE `cart`.`user_id` = ?',
      [req.session.user.id]
      // [req.query.id]
    );
    // console.log('list',list);
    res.json(list);
  } catch (error) {
    console.error(error);
  }
});

// 購物車流程
router.get('/showcart', async (req, res) => {
  // console.log(req.query);
  const productId = req.query.productId;
  // console.log('productId', product_id);
  try {
    // TODO:店家名稱
    const [showcart] = await pool.execute(
      "SELECT `cart`.`user_id`,`cart`.`product_id`, `cart`.`quantity`, `product`.`name`, `product`.`price`, `product`.`store_id`, `product`.`main_photo`, `product`.`photo_path`,`store`.`name` AS `store_name`  FROM (`cart` INNER JOIN `product` ON `cart`.`product_id` = `product`.`id`) INNER JOIN `store` ON `product`.`store_id` = `store`.`id` WHERE `cart`.`product_id` = ?",
      [productId]
    );
    // console.log('------showcart-----', showcart);
    res.json(showcart);
  } catch (error) {
    console.error(error);
  }
});
module.exports = router;
