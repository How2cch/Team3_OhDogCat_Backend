const express = require('express');
const router = express();
const pool = require('../../../utils/db');

router.get('/choices', async (req, res) => {
  // console.log(req.query);
  try {
    let [result] = await pool.execute(
      'SELECT cate.id as cate_id, cate.name AS cate_name, tag.name AS tag_name, tag.id AS tag_id FROM product_tag as tag JOIN product_tag_category AS cate ON tag.tag_category_id = cate.id WHERE tag.product_type_id = 2 ORDER BY `tag_id` ASC'
    );
    let newArr = [];
    result.forEach((data) => {
      const { cate_id, cate_name, ...newObject } = data;
      if (newArr.length === 0 || cate_id !== newArr[newArr.length - 1].cate_id)
        return newArr.push({
          cate_id: cate_id,
          cate_name: cate_name,
          tags: [newObject],
        });
      newArr[newArr.length - 1].tags.push(newObject);
    });
    res.json(newArr);
  } catch (error) {
    console.error(error);
  }
});

router.get('/products', async (req, res) => {
  // console.log(req.query);
  try {
    let [result] = await pool.execute(
      'SELECT name,intro,price,per_score,main_photo,photo_path FROM `product` WHERE product_type_id = ?',[2]
    );
    console.log(result);
    res.json(result);
  } catch (error) {
    console.error(error);
  }
});
module.exports = router;
