const express = require('express');
const router = express();
const pool = require('../../../utils/db');
// const bcrypt = require('bcrypt');
// const { validationResult } = require('express-validator');
// const { registerFormatRules } = require('../middlewares/userAuth.js');
// const path = require('path');

//  ${API_URL}/api/1.0/productdetail

router.get('/', async (req, res) => {
  console.log(req.query);
  let [result] = await pool.execute(
    `SELECT id,name,intro,price,per_score,main_photo,photo_path,product_tag,description,photo.file_name FROM product JOIN product_photo AS photo ON product.id = photo.product_id WHERE product.id = ${req.query.id}`
  );
  let newArr = [];
  result.forEach((data) => {
    const {
      id,
      name,
      intro,
      price,
      per_score,
      main_photo,
      photo_path,
      product_tag,
      description,
      ...newObject
    } = data;
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

module.exports = router;
