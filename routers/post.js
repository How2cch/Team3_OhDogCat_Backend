const express = require('express');
const router = express();
const pool = require('../utils/db');
// 資料庫連接

// const path = require('path');

// 取一般貼文資料
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
module.exports = router;

// 取行程貼文資料 需要關聯資料表
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


// 取全部貼文資料 首頁查詢用
// 會員中心社群設定
router.get('/', async (req, res) => {
  console.log(req.query);
  try {
    let [result] = await pool.execute(
      'SELECT * FROM post WHERE id >= ? AND status >= 1',
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
