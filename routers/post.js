const express = require('express');
const router = express();
const pool = require('../utils/db');

const authMiddleware = require('../middlewares/userAuth');

const path = require('path');

// 取一般貼文資料
// router.get('/post', async (req, res) => {
//   try {
//     console.log(req.session);
//     let [result] = await pool.execute(
//       'SELECT * FROM post WHERE id = ? AND status >=1 AND post_type_id =1',
//       [1]
//     );
//     console.log(result);
//     res.json(result);
//     // 轉換成JSON格式
//   } catch (error) {
//     console.error(error);
//   }
// });

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

// 取行程貼文資料 需要關聯資料表
// 關聯行程名稱 行程預計花費時間 行程貼文
router.get('/postTrip', async (req, res) => {
  console.log(req.query);
  try {
    let [result] = await pool.execute(
      'SELECT * FROM post WHERE  id >= ? AND status >= 1 AND post_type_id =2',
      [1]
    );
    console.log(result);
    res.json(result);
    // 轉換成JSON格式
  } catch (error) {
    console.error(error);
  }
});

// 取全部貼文資料 首頁查詢用
// 會員中心社群設定 /community
router.get('/', async (req, res) => {
  console.log(req.query);
  console.log('===== KEKEKEKE 44444444444444=====', req.session);
  let user_id = req.session.user.id
  console.log(user_id);
  try {
    let [resulta] = await pool.execute(
      'SELECT * FROM post WHERE user_id = ? AND status >= 1',[user_id]
    );
    console.log(resulta);
    res.json(resulta);
    // 轉換成JSON格式
  } catch (error) {
    console.error(error);
  }
});

// 一般貼文內容頁 == /postWYSIWYG
// == /api/1.0/post // KE
router.get('/postDetail', async (req, res) => {
  console.log('postID', req.query.postID)
  const postID = req.query.postID;
  // console.log(postID);
  console.log('===== KEKEKEKE1232131313 =====', req.session);
  let user_id = req.session.user.id
  try {
    let [result] = await pool.execute(
      'SELECT * FROM post WHERE id = ? AND user_id = ? AND status >= 1', [postID, user_id]);
    console.log('postID====7777777=====', postID);
    console.log('user_id=====8888888=====', user_id);
    // console.log(result);
    res.json(result);
    // 轉換成JSON格式
  } catch (error) {
    console.error(error);
  }
});

// TODO: 資料驗證 npm install express-validator
const multer = require('multer');
//  圖片存法
const storage = multer.diskStorage({
  // 設定存擋資料夾 /public/uploads
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname + '..', '..', 'public', 'uploads'));
  },
  filename: function (req, file, cb) {
    console.log('file=========', file);
    const ext = file.originalname.split('.').pop();
    cb(null, `postData-${Date.now()}.${ext}`);
  },
});

const uploader = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (
      file.mimetype !== 'image/jpeg' &&
      file.mimetype !== 'image/jpg' &&
      file.mimetype !== 'image/png' &&
      file.mimetype !== 'image/webp'
    ) {
      cb(new Error('上傳的檔案型態不接受'), false);
    } else {
      cb(null, true);
    }
  },
  // 過濾檔案的大小
  // limits: {
  //   // 1k = 1024 => 200k = 200 * 1024
  //   fileSize: 500 * 1024,
  // },
});

// 所見即所得圖片上傳 //
router.post(
  '/uploadImages',
  uploader.single('files'),
  async (req, res, next) => {
    try {
      // 確認資料有沒有收到
      console.log('postEdit', req.file.filename);
      res.json(req.file.filename);
    } catch (err) {
      console.error(err);
    }
  }
);

// 一般貼文上傳 //
router.post('/postEdit', uploader.single('photo'), async (req, res, next) => {
  try {
    // 確認資料有沒有收到
    console.log('postEdit', req.body);

    let filename = req.file ? '/uploads/' + req.file.filename : '';
    let result = await pool.execute(
      'INSERT INTO post (post_type_id, title, content, main_photo, coordinate, tags) VALUES (?, ?, ?, ?, ?, ?);',
      [
        1,
        req.body.title,
        req.body.content,
        filename,
        req.body.location,
        req.body.tags,
      ]
    );
    console.log('insert new post', result);
    // // 回覆前端
    res.json({ message: 'ok' });
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
