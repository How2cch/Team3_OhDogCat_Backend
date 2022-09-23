const express = require('express');
const router = express();
const pool = require('../utils/db');
// 資料庫連接

// const path = require('path');

// 取全部貼文資料 首頁查詢用luis
// 會員中心社群設定
// NOTE:
router.get('/', async (req, res) => {
  console.log(req.query);
  try {
    let [result] = await pool.execute(
      'SELECT * FROM post WHERE id >= ? AND status >= 1  ',
      [1]
    );
    console.log(result);
    res.json(result);
    // 轉換成JSON格式
  } catch (error) {
    console.error(error);
  }
});

router.post('/', async (req, res) => {
  let myPostID = req.body.id;
  console.log(req.query);
  try {
    let [result] = await pool.execute(
      ' UPDATE post SET status =0 WHERE id = ?',
      [myPostID]
    );
    console.log(result);
    res.json(result);
    // 轉換成JSON格式
  } catch (error) {
    console.error(error);
  }
});

// 單獨取一般貼文資料 抬頭 luis
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

// 單獨取行程貼文資料 抬頭 luis
router.get('/tripPost', async (req, res) => {
  console.log(req.query);
  try {
    let [result] = await pool.execute(
      'SELECT * FROM post WHERE id = ? AND status >= 1 AND post_type_id =2',
      [3]
    );
    console.log(result);
    res.json(result);
    // 轉換成JSON格式
  } catch (error) {
    console.error(error);
  }
});

// 搜尋列表

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

// 匯入行程(travel)＋ (travel_days)編輯用
router.get('/tripDetailImport', async (req, res) => {
  console.log(req.query);
  try {
    let [result] = await pool.execute(
      'SELECT * FROM travel JOIN travel_days AS daycount ON travel.id = daycount.travel_id WHERE travel.id =? AND travel.valid =1 AND daycount.valid = 1  ORDER BY days ASC, sort ASC',
      [1]
    );
    console.log(result);
    res.json(result);
    // 轉換成JSON格式
  } catch (error) {
    console.error(error);
  }
});

// 行程貼文 (post)關聯(travel)日程景點明細(travel_days) （匯入景點資訊）可在關聯景點貼文內容
router.get('/tripPostDetail', async (req, res) => {
  console.log(req.query);
  try {
    let [result] = await pool.execute(
      'SELECT * FROM ((post JOIN travel ON post.travel_id = travel.id) JOIN user ON post.user_id = user.id) JOIN travel_days AS daycount ON post.travel_id = daycount.travel_id WHERE post.travel_id =? ORDER BY days ASC, sort ASC',
      [134]
    );
    console.log(result);
    res.json(result);
    // 轉換成JSON格式
  } catch (error) {
    console.error(error);
  }
});

// 回傳資料
router.post('/tripPostDetailEdit', async (req, res) => {
  console.log('tripPostDetailEdit 被請求');
  // console.log('updateObject', req.body.updateObject);
  const { travel_id, title, coordinate, tags } = req.body.updateObject;
  // console.log('locateDetail', req.body.locateDetail);
  const { id, locate_context, locate_duration } = req.body.locateDetail;
  // let [locateDetail] = req.body.locateDetail;
  // console.log('locateid', id);
  // console.log('locatecontext', locate_context);
  // console.log('locateduration', locate_duration);

  let newArrID = [];
  for (let i = 0; i < id.length; i++) {
    // console.log(i);
    newArrID = [...id[0], ...id[i]];
  }
  // console.log(newArrID);

  let newArrContext = [];
  for (let i = 0; i < id.length; i++) {
    // console.log(i);
    newArrContext = [...locate_context[0], ...locate_context[i]];
  }
  // console.log(newArrContext);

  let newArrDuration = [];
  for (let i = 0; i < id.length; i++) {
    // console.log(i);
    newArrDuration = [...locate_duration[0], ...locate_duration[i]];
  }
  // console.log(newArrDuration);

  let newLocatData = {};
  // for (let j = 0; j < newArrID.length; j++) {
  //   // console.log(j);
  //   newLocatData = {
  //     id: newArrID[j],
  //     context: newArrContext[j],
  //     duration: newArrDuration[j],
  //   };
  //   // console.log(newLocatData);
  // }

  try {
    for (let j = 0; j < newArrID.length; j++) {
      let [resultTravel_days] = await pool.execute(
        `UPDATE travel_days SET locate_duration = ?,locate_context = ? WHERE id = ?`,
        [newArrDuration[j], newArrContext[j], newArrID[j]]
      );
      // console.log(j);
      // console.log(newLocatData);
    }

    // console.log(newLocatData.duration, newLocatData.context, newLocatData.id);
    let [resultPost] = await pool.execute(
      'UPDATE post SET post_title= ?,coordinate=?,tags =? WHERE travel_id = ?',
      [title, coordinate, tags, travel_id]
    );
    // console.log('result', resultPost);
    return res.json({ message: '更新資料ＯＫ', data: resultPost });
    // 轉換成JSON格式
  } catch (error) {
    console.error(error, '更新資料錯誤');
    return res.status(500).json({ message: '錯誤' });
  }
});

module.exports = router;
