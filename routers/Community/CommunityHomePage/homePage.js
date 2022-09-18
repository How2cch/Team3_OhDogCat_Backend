const express = require('express');
const router = express();
const pool = require('../../../utils/db');

router.get('/article', async (req, res) => {
  let [result] = await pool.execute();
  console.log(result);
  res.json(result);
});

// NOTE: 網美貼文，條件應為追蹤數，目前暫定用 id 10 以下
router.get('/kolPost', async (req, res) => {
  console.log(req.query);
  try {
    const [kolPost] = await pool.execute('SELECT post.* ,user.name AS user_name FROM (post JOIN user ON user.id = user_id) WHERE post.id < 10');
    console.log(kolPost);
    res.json(kolPost);
  } catch (error) {
    console.error(error);
  }
});

// NOTE: 熱門貼文，條件應為按讚數，目前暫用id 9 以上
router.get('/hotPost', async (req, res) => {
  console.log(req.query);
  try {
    const [hotPost] = await pool.execute('SELECT post.* ,user.name AS user_name FROM (post JOIN user ON user.id = user_id) WHERE post.id > 9');
    console.log(hotPost);
    res.json(hotPost);
  } catch (error) {
    console.error(error); 
  }
});

// NOTE: 最新貼文，就抓新資料
router.get('/newPost', async (req, res) => {
  console.log(req.query);
  try {
    const [newPost] = await pool.execute('SELECT id, title, main_photo, likes');
    console.log(newPost);
    res.json(newPost);
  } catch (error) {
    console.error(error); 
  }
});

// NOTE: 測試JOIN
router.get('/testAPI', async (req, res) => {
  console.log(req.query);
  try {
    const [newPost] = await pool.execute('SELECT post.* ,user.name AS user_name FROM post JOIN user ON user.id = user_id; ');
    console.log(newPost);
    res.json(newPost);
  } catch (error) {
    console.error(error); 
  }
});

module.exports = router;

