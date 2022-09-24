const express = require('express');
const { check } = require('prettier');
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
    let [resulta] = await pool.execute(
      'SELECT * FROM post WHERE id >= ? AND status >= 1  ',
      [1]
    );
    console.log(resulta);
    res.json(resulta);
    // 轉換成JSON格式
  } catch (error) {
    console.error(error);
  }
});
// 通知資料庫刪除貼文（軟刪除）
router.post('/', async (req, res) => {
  let deleteID = req.body.myPostID;
  console.log(deleteID);
  try {
    let [deleteResult] = await pool.execute(
      ' UPDATE post SET status =0 WHERE id = ?',
      [deleteID]
    );
    console.log(deleteResult);
    res.json(deleteResult);
    // 轉換成JSON格式
  } catch (error) {
    console.error(error);
  }
});

// 按讚互動
router.post('/likes', async (req, res) => {
  try {
    let [resultLike] = await pool.execute(
      ' UPDATE post SET status =0 WHERE id = ?'
    );
    console.log(resultLike);
    res.json(resultLike);
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

// 匯入行程(travel)用 luis
router.get('/tripDetailImport', async (req, res) => {
  console.log(req.query);
  try {
    let [result] = await pool.execute(
      'SELECT * FROM travel WHERE travel.valid =1 ORDER BY id ASC',
      []
    );
    console.log(result);
    res.json(result);
    // 轉換成JSON格式
  } catch (error) {
    console.error(error);
  }
});

// 匯入行程後增加貼文資料ＴＢＡ
router.get('/tripDetailImport', async (req, res) => {
  console.log(req.query);
  try {
    let [result] = await pool.execute(
      'SELECT * FROM travel WHERE travel.valid =1 ORDER BY id ASC',
      []
    );
    console.log(result);
    res.json(result);
    // 轉換成JSON格式
  } catch (error) {
    console.error(error);
  }
});

// 行程貼文 (post)關聯(travel)日程景點明細(travel_days) （匯入景點資訊）可在關聯景點貼文內容 luis
router.get('/tripPostDetail', async (req, res) => {
  const postID = req.query.postID;
  const tripID = req.query.tripID;
  console.log('lolol', req.query.postID);
  console.log('lolal', req.query.tripID);

  try {
    // 1 檢查travel id 是否在對應貼文
    let [checkData] = await pool.execute(
      `SELECT * FROM ((post JOIN travel ON post.travel_id = travel.id) JOIN user ON post.user_id = user.id) JOIN travel_days AS daycount ON post.travel_id = daycount.travel_id WHERE travel.id=? ORDER BY days ASC, sort ASC`,
      [tripID]
    );
    console.log(checkData, 'checkdata');
    res.json(checkData);
    // 轉換成JSON格式
    if (checkData === []) {
      try {
        let [result] = await pool.execute(
          `INSERT INTO post (post_type_id, user_id, post_title, travel_id, status) VALUES (2,2,'終於新增了',?,2)`,
          [tripID]
        );
        // console.log(result);
        res.json(result);
        // 轉換成JSON格式
      } catch (error) {
        console.error(error);
      }
    } else {
    }
  } catch (error) {
    console.error(error);
  }
});

// 回傳更新資料 luis
router.post('/tripPostDetailEdit', async (req, res) => {
  const { travel_id, title, coordinate, tags } = req.body.updateObject;
  const { id, locate_context, locate_duration } = req.body.locateDetail;

  let newArrID = [];
  let newArrContext = [];
  let newArrDuration = [];
  for (let i = 0; i < id.length; i++) {
    newArrID = [...id[0], ...id[i]];
    newArrContext = [...locate_context[0], ...locate_context[i]];
    newArrDuration = [...locate_duration[0], ...locate_duration[i]];
  }

  // let newLocatData = {};
  try {
    for (let j = 0; j < newArrID.length; j++) {
      let [resultTravel_days] = await pool.execute(
        `UPDATE travel_days SET locate_duration = ?,locate_context = ? WHERE id = ?`,
        [newArrDuration[j], newArrContext[j], newArrID[j]]
      );
      // console.log(j);
      // console.log(resultTravel_days);
    }
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
