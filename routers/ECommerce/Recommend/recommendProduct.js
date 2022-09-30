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

// ---- /api/1.0/product/news
router.get('/news', async (req, res) => {
  try {
    const arrStr = [
      { id: '2', keyword: '室內景點' },
      { id: '4', keyword: '狗罐頭' },
      { id: '3', keyword: '咖啡廳' },
      { id: '2', keyword: '戶外活動' },
    ];
    let newsArr = [];
    for (let index = 0; index < arrStr.length; index++) {
      const [product] = await pool.execute(
        `SELECT id, name, price, per_score, photo_path,main_photo FROM product WHERE product_type_id = ${arrStr[index].id} And product_tag LIKE '%${arrStr[index].keyword}%' LIMIT 3`
      );
      const data = product;
      // console.log(data);
      newsArr.push(data);

      // arrStr[index].setState(data);
    }
    // console.log('newsArr', newsArr);
    res.json(newsArr);
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
