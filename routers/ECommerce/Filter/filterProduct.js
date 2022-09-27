const express = require('express');
const router = express();
const pool = require('../../../utils/db');

//取得篩選選項
// = /api/1.0/filter/choices
router.get('/choices', async (req, res) => {
  // console.log(req.query);
  const typeId = req.query.typeId || 2;

  try {
    let [result] = await pool.execute(
      `SELECT cate.id as cate_id, cate.name AS cate_name, tag.name AS tag_name, tag.id AS tag_id FROM product_tag as tag JOIN product_tag_category AS cate ON tag.tag_category_id = cate.id WHERE tag.product_type_id = ${typeId} ORDER BY tag_id ASC`
    );
    let newArr = [];
    result.forEach((data) => {
      const { cate_id, cate_name, ...newObject } = data;
      // console.log(data);
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

//取得商品列表
// >>/filter/products
router.get('/products', async (req, res) => {
  const { typeId, order, search, page, maxPrice, minPrice, tag } = req.query;
  console.log(req.query);
  console.log('==============================');

  try {
    // 取得頁數---------------------
    const page = req.query.page || 1;
    const typeId = req.query.typeId || 2;

    const searchWord = search ? `AND name LIKE '%${search}%'` : '';
    // if (tag) {
    // TODO搜尋
    let tagArray = tag.split(',');
    let tagSelect = 'AND';
    if (tagArray.length === 0) {
      tagSelect = '';
    } else {
      for (let i = 0; i < tagArray.length; i++) {
        if (i === tagArray.length - 1) {
          tagSelect += ` product_tag LIKE '%${tagArray[i]}%'`;
        } else {
          tagSelect += ` product_tag LIKE '%${tagArray[i]}%' OR `;
        }
      }
    }
    // }
    const tagResult = tag ? tagSelect : '';

    const priceCount =
      maxPrice || minPrice
        ? `AND (price BETWEEN ${minPrice} AND ${maxPrice})`
        : '';
    // orderType
    let orderType = null;
    switch (order) {
      case '1':
        orderType = 'price DESC';
        break;
      case '2':
        orderType = 'price ASC';
        break;
      case '3':
        orderType = 'per_score DESC';
        break;
      case '4':
        orderType = 'per_score ASC';
        break;
      default:
        orderType = 'id ASC';
    }

    // 每一頁拿五筆資料
    const perPage = 5;
    // 取得總筆數
    let [total] = await pool.execute(
      `SELECT COUNT(*) AS total FROM product WHERE product_type_id = ${typeId} ${searchWord} ${tagResult} ${priceCount} ORDER BY ${orderType} `
    );

    const totalAll = total[0].total;
    let lastPage = Math.ceil(totalAll / perPage);
    const offset = perPage * (page - 1);

    let newSql = `LIMIT ${perPage} OFFSET ${offset}`;
    let [data] = await pool.execute(
      `SELECT id,product_type_id,name,intro,price,per_score,main_photo,photo_path,product_tag FROM product WHERE product_type_id = ${typeId} ${searchWord}${tagResult}${priceCount} ORDER BY ${orderType} ${newSql} `
    );

    // 把取得的資料回覆給前端
    res.json({
      pagesDetail: {
        total, // 總共有幾筆
        perPage, // 一頁有幾筆
        page, // 目前在第幾頁
        lastPage, // 總頁數
        offset,
      },
      data,
    });
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
