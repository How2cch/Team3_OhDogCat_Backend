const express = require('express');
const router = express();
const pool = require('../utils/db');
// 資料庫連接

// const path = require('path');

// 取一般貼文資料 luis
router.get('/post', async (req, res) => {
  console.log(req.query);
  try {
    let [result] = await pool.execute(
      'SELECT * FROM post WHERE id >= ? AND status >=1 AND post_type_id =1',
      [
        1,
        //  'SELECT cate.id as cate_id, cate.name AS cate_name, tag.name AS tag_name, tag.id AS tag_id FROM product_tag as tag JOIN product_tag_category AS cate ON tag.tag_category_id = cate.id WHERE tag.product_type_id = 2 ORDER BY `tag_id` ASC'
      ]
    );
    console.log(result);
    res.json(result);
    // 轉換成JSON格式
  } catch (error) {
    console.error(error);
  }
});

router.get('/searchList', async (req, res) => {
  const { search } = req.query;
  console.log(req.query);
  try {
    let [result] = await pool.execute(
      `SELECT * FROM post WHERE (title LIKE '%${search}%') OR (content LIKE '%${search}%') OR (coordinate LIKE '%${search}%') OR (tags LIKE '%${search}%');`
    );
    console.log(result);
    res.json(result);
    // 轉換成JSON格式
  } catch (error) {
    console.error(error);
  }
});

// 取行程貼文資料 需要關聯資料表 luis
// 關聯行程名稱 行程預計花費時間 行程貼文
router.get('/postTrip', async (req, res) => {
  console.log(req.query);
  try {
    let [result] = await pool.execute(
      'SELECT * FROM post WHERE id >= ? AND status >= 1 AND post_type_id =2',
      [1]
    );
    console.log(result);
    res.json(result);
    // 轉換成JSON格式
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;

// 單獨取行程＋明細 編輯用
router.get('/postTripEdit', async (req, res) => {
  console.log(req.query);
  try {
    let [result] = await pool.execute(
      'SELECT * FROM travel JOIN travel_days AS daycount ON travel.id = daycount.travel_id WHERE travel.id =? AND travel.valid =1 AND daycount.valid = 1',
      [134]
    );
    console.log(result);
    res.json(result);
    // 轉換成JSON格式
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;

// 取行程資料關聯日程景點明細 （匯入景點資訊）可在關聯景點貼文內容
router.get('/trip', async (req, res) => {
  console.log(req.query);
  try {
    let [result] = await pool.execute(
      'SELECT * FROM ((post JOIN travel ON post.travel_id = travel.id) JOIN user ON post.user_id = user.id) JOIN travel_days AS daycount ON post.travel_id = daycount.travel_id WHERE travel.id =? AND post_type_id = 2 ORDER BY days ASC, sort ASC',
      [134]
    );
    console.log(result);
    res.json(result);
    // 轉換成JSON格式
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;

// 取全部貼文資料 首頁查詢用luis
// 會員中心社群設定
// NOTE:
router.get('/', async (req, res) => {
  console.log(req.query);
  try {
    let [result] = await pool.execute(
      'SELECT * FROM post WHERE id >= ? AND status >= 1 ',
      [1]
    );
    console.log(result);
    res.json(result);
    // 轉換成JSON格式
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
