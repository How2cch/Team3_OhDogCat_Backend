const express = require('express');
const { check } = require('prettier');
const router = express();
const pool = require('../utils/db');
const multer = require('multer');
const path = require('path');

// 資料庫連接

const authMiddleware = require('../middlewares/userAuth');

const path = require('path');

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
    // console.log(resulta);
    res.json(resulta);
    // 轉換成JSON格式
  } catch (error) {
    console.error(error);
  }
});

// 通知資料庫刪除貼文（軟刪除）
router.post('/', async (req, res) => {
  let deleteID = req.body.myPostID;
  // console.log(deleteID);
  const userID = req.session.user.id;
  console.log(userID);
  try {
    let [deleteResult] = await pool.execute(
      ' UPDATE post SET status =0 WHERE id = ?',
      [deleteID]
    );
    // console.log(deleteResult);
    res.json(deleteResult);
    // 轉換成JSON格式
  } catch (error) {
    console.error(error);
  }
});

// 發布貼文
router.post('/release', async (req, res) => {
  let postID = req.body.postID;
  let state = req.body.postState;
  console.log('post', postID);
  try {
    let [result] = await pool.execute(
      ' UPDATE post SET status =? WHERE id = ?',
      [state, postID]
    );
    // console.log(deleteResult);
    res.json(result);
    // 轉換成JSON格式
  } catch (error) {
    console.error(error);
  }
});

// 按讚數統計：

router.get('/likesStatic', async (req, res) => {
  // const userLike = req.session.user;
  // console.log('查詢使用者按讚文章', userID);
  try {
    let [postLikeresult] = await pool.execute(
      ' SELECT * FROM post_like JOIN post ON post_like.post_id = post.id WHERE post_like.user_id>=? ORDER BY post_id DESC',
      [1]
    );
    console.log('該使用的按讚貼文資訊', postLikeresult);
    res.json(postLikeresult);
    // 轉換成JSON格式
  } catch (error) {
    console.error(error);
  }
});

// 按讚互動 luis
router.post('/likes', async (req, res) => {
  const likesState = req.body.likesState;
  const postID = req.body.postID;
  console.log(likesState, postID);

  if (likesState === 1) {
    try {
      // console.log(1);
      let [addLike] = await pool.execute(
        'DELETE FROM `post_like` WHERE post_id=?',
        [postID]
      );
      console.log(addLike);
      res.json(addLike);
      // 轉換成JSON格式
    } catch (error) {
      console.error(error);
    }
  } else {
    try {
      // console.log(0);
      let [removeLike] = await pool.execute(
        'INSERT INTO `post_like` (`post_id`, `user_id`) VALUES (?, 2)',
        [postID]
      );
      console.log(removeLike);
      res.json(removeLike);
      // 轉換成JSON格式
    } catch (error) {
      console.error(error);
    }
  }
});

// 單獨取一般貼文資料 抬頭 luis
router.get('/post', async (req, res) => {
  // console.log(req.query);
  try {
    let [result] = await pool.execute(
      'SELECT * FROM post WHERE id >= ? AND status >=1 AND post_type_id =1',
      [
        1,
        //  'SELECT cate.id as cate_id, cate.name AS cate_name, tag.name AS tag_name, tag.id AS tag_id FROM product_tag as tag JOIN product_tag_category AS cate ON tag.tag_category_id = cate.id WHERE tag.product_type_id = 2 ORDER BY `tag_id` ASC'
      ]
    );
    // console.log(result);
    res.json(result);
    // 轉換成JSON格式
  } catch (error) {
    console.error(error);
  }
});

// 單獨取行程貼文資料 抬頭 luis
router.get('/tripPost', async (req, res) => {
  try {
    let [result] = await pool.execute(
      'SELECT * FROM post WHERE id >= ? AND status >= 1 AND post_type_id =2',
      [1]
    );
    // console.log(result);
    res.json(result);
    // 轉換成JSON格式
  } catch (error) {
    console.error(error);
  }
});

// 搜尋列表
router.get('/searchList', async (req, res) => {
  const { search } = req.query;
  // console.log(req.query);
  try {
    let [result] = await pool.execute(
      `SELECT * FROM post WHERE (title LIKE '%${search}%') OR (content LIKE '%${search}%') OR (coordinate LIKE '%${search}%') OR (tags LIKE '%${search}%');`
    );
    // console.log(result);
    res.json(result);
    // 轉換成JSON格式
  } catch (error) {
    console.error(error);
  }
});

// 匯入行程(travel)用 luis
router.get('/tripDetailImport', async (req, res) => {
  // console.log(req.query);
  try {
    let [result] = await pool.execute(
      // 'SELECT * FROM post WHERE  id >= ? AND status >= 1 AND post_type_id =2',
      // [1]
      'SELECT * FROM travel WHERE travel.valid =1 AND user_id >=1 ORDER BY id ASC',
      []
    );
    // console.log(result);
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
  let user_id = req.session.user.id;
  console.log(user_id);
  try {
    let [resulta] = await pool.execute(
      'SELECT * FROM post WHERE user_id = ? AND status >= 1',
      [user_id]
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
  console.log('postID', req.query.postID);
  const postID = req.query.postID;
  // console.log(postID);
  console.log('===== KEKEKEKE1232131313 =====', req.session);
  let user_id = req.session.user.id;
  try {
    let [result] = await pool.execute(
      'SELECT * FROM post WHERE id = ? AND user_id = ? AND status >= 1',
      [postID, user_id]
    );
    console.log('postID====7777777=====', postID);
    console.log('user_id=====8888888=====', user_id);
    // console.log(result);
    res.json(result);
  } catch (error) {
    console.error(error);
  }
});
// 1 檢查travel id 是否在對應貼文
router.post('/tripPostNew', async (req, res) => {
  const tripID = req.body.tripID;
  const createTime = req.body.createTime;

  try {
    let [postResult] = await pool.execute(
      `INSERT INTO post (post_type_id, user_id, post_title, travel_id, status, create_time) VALUES (2,2,'請點擊新增貼文標題',?,2,?)`,
      [tripID, createTime]
    );
    // TODO: 一定travel 表裡面的ID欄位和travel days 表裡面的travel_id 有資料才能新增行程貼文

    // console.log(postResult);
    res.json(postResult);
    return res.json({ message: '新增貼文ＯＫ', data: postResult });
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

// 行程貼文 (post)關聯(travel)日程景點明細(travel_days) （匯入景點資訊）可在關聯景點貼文內容 luis
router.get('/tripPostDetail', async (req, res) => {
  // const postID = req.query.postID;
  const postID = req.query.postID;
  console.log('lolol', req.query.postID);
  try {
    let [checkPostData] = await pool.execute(
      `SELECT * FROM ((post JOIN travel ON post.travel_id = travel.id) JOIN user ON post.user_id = user.id) JOIN travel_days AS daycount ON post.travel_id = daycount.travel_id WHERE post.id=? ORDER BY days ASC, sort ASC`,
      [postID]
    );
    // console.log(checkPostData, 'checkPodstData');
    res.json(checkPostData);
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

// 行程貼文封面照片上傳--------------------------------------------------------------------------------------

//　1. 圖片設定儲存空間
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(
      null,
      path.join(__dirname, '..', '..', '..', 'public', 'tripPost', 'coverPhoto')
    );
  },
  // 圖片名稱
  filename: function (req, file, cb) {
    console.log('file', file);
    const ext = file.originalname.split('.').pop();
    cb(null, `/travel-${uuidv4()}.${ext}`);
  },
});

const uploader = multer({
  storage: storage,
  // 過濾圖片的種類
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
  limits: {
    // 1k = 1024 => 200k = 200 * 1024
    fileSize: 200 * 1024,
  },
});

//===============================================================================================
router.post(
  '/tripPostCoverUpload',
  uploader.single('photo'),
  async (req, res) => {
    const postID = req.body.postID;
    const coverPhoto = req.body.preview;
    const coverFile = req.body.coverFile;
    console.log('post', postID);
    console.log('preview', coverPhoto);
    console.log('coverFile', coverFile.photo);
    try {
      let [coverPhotoUpload] = await pool.execute(
        ' UPDATE post SET main_photo =? WHERE id = ?',
        [coverPhoto, postID]
      );
      // console.log(deleteResult);
      res.json(coverPhotoUpload);
      // 轉換成JSON格式
    } catch (error) {
      console.error(error);
    }
  }
);

module.exports = router;
