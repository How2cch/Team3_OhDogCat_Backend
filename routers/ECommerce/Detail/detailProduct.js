const express = require('express');
const router = express();
const pool = require('../../../utils/db');
// const bcrypt = require('bcrypt');
// const { validationResult } = require('express-validator');
// const { registerFormatRules } = require('../middlewares/userAuth.js');
// const path = require('path');

// 商品細節細項
//  ${API_URL}/api/1.0/productdetail/item?
router.get('/item', async (req, res) => {
  const product_id = req.query.id;
  console.log(product_id);
  let [result] = await pool.execute(
    `SELECT id,product_type_id,name,intro,price,per_score,main_photo,photo_path,product_tag,description,photo.file_name FROM product JOIN product_photo AS photo ON product.id = photo.product_id WHERE product.id = ${product_id}`
  );
  let newArr = [];
  result.forEach((data) => {
    const { id, name, intro, price, per_score, main_photo, photo_path, product_tag, description, ...newObject } = data;
    if (newArr.length === 0 || id !== newArr[newArr.length - 1].id)
      return newArr.push({
        id: id,
        name: name,
        intro: intro,
        description: description,
        price: price,
        main_photo: main_photo,
        photo_path: photo_path,
        product_tag: product_tag,
        per_score: per_score,
        photo: [newObject],
      });
    newArr[newArr.length - 1].photo.push(newObject);
  });
  console.log(newArr);
  res.json(newArr[0]);
});

// 推薦商品
//  ${API_URL}/api/1.0/productdetail/recommend?

router.get('/recommend', async (req, res) => {
  // console.log(req.query);
  try {
    const [recommend] = await pool.execute(`SELECT id,name, price,photo_path,main_photo FROM product WHERE product_type_id = 4 ORDER BY RAND() LIMIT ?`, [2]);
    console.log(recommend);
    res.json(recommend);
  } catch (error) {
    console.error(error);
  }
});

// 評論
//  ${API_URL}/api/1.0/productdetail/comment
router.get('/comment', async (req, res) => {
  // console.log(req.query);
  try {
    const [comment] = await pool.execute(
      `SELECT product_comment.* ,social_name, photo FROM  product_comment JOIN user ON product_comment.product_comment_user_id = user.id WHERE product_id = ?`,
      [req.query.id]
    );
    console.log(comment);
    res.json(comment);
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
  