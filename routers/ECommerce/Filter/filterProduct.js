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
  console.log(req.query);
  console.log('==============================');

  try {
    // 取得商品資料-------------------
    let [result] = await pool.execute(
      'SELECT name,intro,price,per_score,main_photo,photo_path FROM `product` WHERE product_type_id = ? ',
      [2]
    );
    console.log(result);
    // res.json(result);

    // 取得頁數---------------------

    // /pages/:storeId
    // const stockId = req.params.stockId;
    const typeId = 2;
    console.log(req.query);
    // 分頁
    // 透過 query string 取得目前要第幾頁的資料
    // 如果沒有設定，就預設要第一頁的資料
    let page = req.query.page || 1;
    // let page = 1;

    // 每一頁拿五筆資料
    const perPage = 1;
    // 取得總筆數
    const [total] = await pool.execute(
      'SELECT COUNT(*) AS total FROM product WHERE product_type_id= ?',
      [typeId]
    );
    const totalAll = total[0].total;
    // console.log(totalAll);
    // 計算總頁數 Math.ceil
    let lastPage = Math.ceil(totalAll / perPage);

    // 計算 offset
    const offset = perPage * (page - 1);

    // 根據 perPage 及 offset 去取得資料
    let [data] = await pool.execute(
      'SELECT name,intro,price,per_score,main_photo,photo_path FROM `product` WHERE product_type_id = ? ORDER BY ? LIMIT ? OFFSET ?',
      [typeId, req.query.sortid, perPage, offset]
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
      // result,
    });
  } catch (error) {
    console.error(error);
  }
});

// 沒有用
// router.get('/products/:stockId', async (req, res, next) => {
//   try {
//     // /pages/:stockId
//     // const stockId = req.params.stockId;
//     const stockId = 2;

//     // 分頁
//     // 透過 query string 取得目前要第幾頁的資料
//     // 如果沒有設定，就預設要第一頁的資料
//     let page = req.query.page || 1;
//     // let page = 1;

//     // 每一頁拿五筆資料
//     const perPage = 5;
//     // 取得總筆數
//     const [total] = await pool.execute(
//       'SELECT COUNT(*) AS total FROM product WHERE product_type_id= ?',
//       [stockId]
//     );
//     // console.log(total);
//     const totalAll = total[0].total;
//     // console.log(totalAll);
//     // 計算總頁數 Math.ceil
//     let lastPage = Math.ceil(totalAll / perPage);

//     // 計算 offset
//     const offset = perPage * (page - 1);

//     // 根據 perPage 及 offset 去取得資料
//     let [data] = await pool.execute(
//       'SELECT name,intro,price,per_score,main_photo,photo_path FROM `product` WHERE product_type_id = ? ORDER BY id LIMIT ? OFFSET ?',
//       [stockId, perPage, offset]
//     );

//     // 把取得的資料回覆給前端
//     res.json({
//       pagesDetail: {
//         total, // 總共有幾筆
//         perPage, // 一頁有幾筆
//         page, // 目前在第幾頁
//         lastPage, // 總頁數
//       },
//       data,
//     });
//   } catch (error) {
//     console.error(error);
//   }
// });
// module.exports = router;
