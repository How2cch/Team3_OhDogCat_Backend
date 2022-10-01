const express = require('express');
const router = express();
const pool = require('../../../utils/db');

router.get('/', async (req, res) => {
  console.log(req.query);
  try {
    const { search } = req.query;
    const [searchResult] = await pool.execute(
      `SELECT * FROM post WHERE (title LIKE '%${search}%') OR (content LIKE '%${search}%') OR (coordinate LIKE '%${search}%') OR (tags LIKE '%${search}%');`
    );
    // console.log('searchResult', searchResult);
    res.json(searchResult);
  } catch (error) {
    console.error(error);
  }
});

// NOTE: 網美貼文，條件應為追蹤數，目前暫定 id 10 以下
// router.get('/kolPost', async (req, res) => {
//   console.log(req.query);
//   try {
//     const [kolPost] = await pool.execute(
//       'SELECT post.* ,user.social_name FROM (post JOIN user ON user.id = user_id) WHERE post.id > 3 AND post.id < 10'
//     );
//     console.log(kolPost);
//     res.json(kolPost);
//   } catch (error) {
//     console.error(error);
//   }
// });

// ==============================采平===================================

// 寵物網美假資料版
router.get('/kolPost', async (req, res) => {
  console.log(req.query);
  try {
    const [kolPost] = await pool.execute('SELECT * FROM post WHERE post.id > 1 AND post.id < 22');
    // console.log(kolPost);
    res.json(kolPost);
  } catch (error) {
    console.error(error);
  }
});

// 瀑布流資料(post資料表全部展示)

router.get('/allPost', async (req, res) => {
  try {
    const [allPost] = await pool.execute(
      'SELECT `post`.`id`,`post`.`user_id`, `post`.`post_title`, `post`.`main_photo`, `post`.`coordinate`, `post`.`likes`, `user`.`id`, `user`.`social_name`, `user`.`photo` FROM `post` JOIN `user` ON `post`.`user_id` = `user`.`id`'
    );
    // console.log('================allPost=================', allPost);
    res.json(allPost);
  } catch (error) {
    console.error('抓取社群瀑布流貼文失敗', error);
  }
});

// 一般貼文資料(post資料表post_type_id = 1 前十筆)

router.get('/normalPost', async (req, res) => {
  try {
    const [normalPost] = await pool.execute(
      'SELECT `post`.`id`,`post`.`user_id`, `post`.`post_title`, `post`.`main_photo`, `post`.`coordinate`, `post`.`likes`, `user`.`id`, `user`.`social_name`, `user`.`photo` FROM `post` JOIN `user` ON `post`.`user_id` = `user`.`id` WHERE `post`.`post_type_id` = ? AND `post`.`id` < ?',
      [1, 11]
    );
    console.log('================normalPost=================', normalPost);
    res.json(normalPost);
  } catch (error) {
    console.error('抓取社群一般貼文失敗', error);
  }
});
// 行程貼文資料(post資料表post_type_id = 2 前十筆)

router.get('/travelPost', async (req, res) => {
  try {
    const [travelPost] = await pool.execute(
      'SELECT `post`.`id`,`post`.`user_id`, `post`.`post_title`, `post`.`main_photo`, `post`.`coordinate`, `post`.`likes`, `user`.`id`, `user`.`social_name`, `user`.`photo` FROM `post` JOIN `user` ON `post`.`user_id` = `user`.`id` WHERE `post`.`post_type_id` = ? AND `post`.`id` < ?',
      [2, 54]
    );
    console.log('================travelPost=================', travelPost);
    res.json(travelPost);
  } catch (error) {
    console.error('抓取社群一般貼文失敗', error);
  }
});

// ==============================采平===================================

// NOTE: 熱門貼文，條件應為按讚數，目前暫用id 9 以上
router.get('/hotPost', async (req, res) => {
  console.log(req.query);
  try {
    const [hotPost] = await pool.execute(
      'SELECT post.* ,user.social_name FROM (post JOIN user ON user.id = user_id) WHERE post.id > 9'
    );
    // console.log(hotPost);
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
    // console.log(newPost);
    res.json(newPost);
  } catch (error) {
    console.error(error);
  }
});

// NOTE: 測試JOIN
router.get('/testAPI', async (req, res) => {
  console.log(req.query);
  try {
    const [newPost] = await pool.execute('SELECT post.* ,user.social_name FROM post JOIN user ON user.id = user_id; ');
    // console.log(newPost);
    res.json(newPost);
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
