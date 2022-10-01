const express = require('express');
const { check } = require('prettier');
const router = express();
const pool = require('../utils/db');
const { v4: uuidv4 } = require('uuid');

// 資料庫連接

const authMiddleware = require('../middlewares/userAuth');

const path = require('path');

// 取全部貼文資料 首頁查詢用luis
// 會員中心社群設定 所有發布中的貼文
// router.get('/', async (req, res) => {
//   console.log(req.query);
//   try {
//     let [resulta] = await pool.execute(
//       'SELECT * FROM post WHERE id >= ? AND status = 1  ',
//       [1]
//     );
//     // console.log(resulta);
//     res.json(resulta);
//     // 轉換成JSON格式
//   } catch (error) {
//     console.error(error);
//   }
// });

// 通知資料庫刪除貼文（軟刪除） luis
router.post('/', async (req, res) => {
  let deleteID = req.body.myPostID;
  //TODO:偵測userID
  // const userID = req.session.user.id;
  // console.log(userID);
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

// 從編輯狀態發布貼文 luis
router.post('/release', async (req, res) => {
  let postID = req.body.postID;
  let state = req.body.postState;
  // console.log('post', postID);
  try {
    let [result] = await pool.execute(
      ' UPDATE post SET status =1 WHERE id = ?',
      [postID]
    );
    // console.log(deleteResult);
    res.json(result);
    // 轉換成JSON格式
  } catch (error) {
    console.error(error);
  }
});

// 按讚數統計：
// 查詢單一會員是否對單一貼文按讚狀態
router.post('/unlike', async (req, res) => {
  let unLikeID = req.body.unLikeID;

  try {
    let [postunLike] = await pool.execute(
      'DELETE FROM `post_like` WHERE `post_id`=? AND `user_id` =1',
      [unLikeID]
    );
    // console.log('該使用的按讚貼文資訊', postunLike);
    res.json(postunLike);
    console.log(postunLike);
    // 轉換成JSON格式
  } catch (error) {
    console.error(error);
  }
});

// 按讚數統計：會員中心 查單一會員按讚貼文資訊 luis
router.get('/likesStatic', async (req, res) => {
  try {
    let [postLikeresult] = await pool.execute(
      ' SELECT * FROM post_like JOIN post ON post_like.post_id = post.id WHERE post_like.user_id>=? ORDER BY post_id DESC',
      [1]
    );
    // console.log('該使用的按讚貼文資訊', postLikeState);
    res.json(postLikeState);
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
  // TODO:偵測userID
  const userLike = req.body.userID;
  const likesState = req.body.likesState;
  const postID = req.body.postID;
  const likesCount = req.body.likes;
  let newLikeCount = '';
  console.log(
    '按讚狀態',
    likesState,
    '貼文ID',
    postID,
    '原始按讚數',
    likesCount,
    'userID',
    userLike
  );
  likesState
    ? (newLikeCount = likesCount + 1)
    : (newLikeCount = likesCount - 1);
  console.log('新按讚數', newLikeCount);

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
      // console.error(error);
      return;
    }
    try {
      let [addLikePost] = await pool.execute(
        'Update post SET `likes` = ? WHERE id=?',
        [newLikeCount, postID]
      );
      // console.log(addLikePost);
      res.json(addLikePost);
    } catch (error) {
      // console.error(error);
      return;
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
      return;
    }
    try {
      let [removeLikePost] = await pool.execute(
        'Update post SET `likes` = ? WHERE id=?',
        [newLikeCount, postID]
      );
      console.log(removeLikePost);
      res.json(removeLikePost);
      // 轉換成JSON格式
    } catch (error) {
      console.error(error);
      return;
    }
  }
});

// 單獨取一般貼文資料 抬頭 luis
router.get('/post', async (req, res) => {
  let user_id = req.body.user_id;
  console.log('user_id', user_id);
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
  // TODO:偵測userID
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

// 搜尋列表 孝強
router.get('/searchList', async (req, res) => {
  const { search } = req.query;
  // console.log(req.query);
  try {
    let [result] = await pool.execute(
      `SELECT * FROM post WHERE (post_title LIKE '%${search}%') OR (content LIKE '%${search}%') OR (coordinate LIKE '%${search}%') OR (tags LIKE '%${search}%');`
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
  // TODO: 偵測userID
  try {
    let [result] = await pool.execute(
      'SELECT * FROM travel WHERE travel.valid =1 AND user_id >=1 AND valid=1 ORDER BY id ASC'
    );
    // console.log(result);
    res.json(result);
    // 轉換成JSON格式
  } catch (error) {
    console.error(error);
  }
});

// 取全部貼文資料 首頁查詢用
// 會員中心社群設定 /community 孝強
router.get('/postAll', async (req, res) => {

  try {
    let [resulta] = await pool.execute(
      'SELECT * FROM post WHERE user_id = ? AND status >= 1',
      [1]
    );
    console.log(result);
    res.json(result);
    // 轉換成JSON格式
  } catch (error) {
    console.error(error);
  }
});

// 一般貼文內容頁 ==
// == /api/1.0/post // KE
router.get('/postDetail', async (req, res) => {
  console.log('postID', req.query.postID);
  const postID = req.query.postID;
  // const user_id = req.body.user_id
  // console.log(postID);
  // console.log('===== KEKEKEKE1232131313 =====', req.session);
  // let user_id = req.session.user.id;
  try {
    let [result] = await pool.execute(
      // 'SELECT * FROM post WHERE id = ? AND user_id = ? AND status >= 1',
      'SELECT post.*, user.social_name FROM (post JOIN user on post.user_id = user.id) WHERE post.id = ? AND status >=1',
      [postID]
    );
    // console.log('postID====7777777=====', postID);
    // console.log('user_id=====8888888=====', user_id);
    // console.log(result);
    res.json(result);
  } catch (error) {
    console.error(error);
  }
});

// 1 檢查travel id 是否在對應貼文
// 新增行程貼文
router.post('/tripPostNew', async (req, res) => {
  const tripID = req.body.tripID;
  const createTime = req.body.createTime;
  // TODO:偵測userID
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

// TODO: 資料驗證 npm install express-validator 孝強 TODO: 要載這個嗎？
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

// 所見即所得圖片上傳 KE//
// 所見即所得圖片上傳 // 孝強
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

// 一般貼文上傳、更新 KE//
// 一般貼文上傳 // 孝強
router.post('/postEdit', uploader.single('photo'), async (req, res, next) => {
  try {
    // 確認資料有沒有收到
    console.log('postEdit', req.body);
    let filename = req.file ? '/uploads/' + req.file.filename : '';
    if (req.body.post_id === 'null') {
      let result = await pool.execute(
        'INSERT INTO post (user_id, post_type_id, post_title, content, post_main_photo, create_time, coordinate, tags, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);',
        [
          req.body.user_id,
          req.body.post_type_id,
          req.body.title,
          req.body.content,
          filename,
          req.body.create_time,
          req.body.location,
          req.body.tags,
          req.body.status,
        ]
      );
    } else {
      let result = await pool.execute(
        'UPDATE post SET user_id = ?, post_title = ?, content = ?, post_main_photo=?, update_time = ?, coordinate= ?, tags = ?, status=? WHERE id = ?;',
        [
          req.body.user_id,
          req.body.title,
          req.body.content,
          filename,
          req.body.create_time,
          req.body.location,
          req.body.tags,
          req.body.status,
          req.body.post_id,
        ]
      );
    }
    // console.log('insert new post', result);
    // // 回覆前端
    res.json({ message: 'ok' });
  } catch (err) {
    console.error(err);
  }
});

// 行程貼文 (post)關聯(travel)日程景點明細(travel_days) （匯入景點資訊）可在關聯景點貼文內容 luis
// ？編輯頁面  /community/tripPostDetail
router.get('/tripPostDetail', async (req, res) => {
  // const postID = req.query.postID;
  const postID = req.query.postID;
  // console.log('lolol', req.query.postID);
  try {
    let [checkPostData] = await pool.execute(
      `SELECT * FROM ((post JOIN travel ON post.travel_id = travel.id) JOIN user ON post.user_id = user.id) JOIN travel_days AS daycount ON post.travel_id = daycount.travel_id WHERE post.id=? AND travel.valid= 1 ORDER BY days ASC, sort ASC`,
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
  const { travel_id, title, coordinate, tags, updateTime } =
    req.body.updateObject;
  const { id, locate_context, locate_intro } = req.body.locateDetail;

  console.log('locate context', locate_context);

  console.log('locate intro', locate_intro);
  console.log('id', id);

  let newArrID = [];
  let newArrContext = [];
  let newArrIntro = [];
  for (let i = 0; i < id.length; i++) {
    // console.log('tet', id[i]);
    newArrID.push(...id[i]);
    newArrContext.push(...locate_context[i]);
    newArrIntro.push(...locate_intro[i]);
  }
  console.log('newID', newArrID);
  console.log('newcontext', newArrContext);
  console.log('newintro', newArrIntro);
  // let newLocatData = {};
  try {
    for (let j = 0; j < newArrID.length; j++) {
      let [resultTravel_days] = await pool.execute(
        `UPDATE travel_days SET locate_intro = ?,locate_context = ? WHERE id = ?`,
        [newArrIntro[j], newArrContext[j], newArrID[j]]
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

// 行程貼文封面照片上傳 luis--------------------------------------------------------------------------------------

//　圖片設定儲存空間
const storageTripPostCover = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'public', 'tripPost', 'coverPhoto'));
    console.log(__dirname);
    // 確認資料夾位置正確
  },
  // 圖片設定名稱
  filename: function (req, file, cb) {
    console.log('file', file);
    const ext = file.originalname.split('.').pop();
    cb(null, `/travel-${uuidv4()}.${ext}`);
  },
});

const uploaderTripPostCover = multer({
  storage: storageTripPostCover,
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
  // ,
  // // 過濾檔案的大小
  // limits: {
  //   // 1k = 1024 => 200k = 200 * 1024
  //   fileSize: 200 * 1024,
  // },
});

//===============================================================================================
router.post(
  '/tripPostCoverUpload',
  uploaderTripPostCover.single('photo'),
  async (req, res) => {
    const postID = req.body.postID;
    // const coverPhoto = req.body.preview;
    // const coverFile = req.body.coverFile;
    //TODO: 偵測userID
    // console.log('貼文ＩＤ', req.body.postID);

    try {
      let filename = req.file ? 'tripPost/coverPhoto' + req.file.filename : '';
      console.log('檔案名稱', filename);
      // console.log('貼文ＩＤ', postID);
      let [coverPhotoUpload] = await pool.execute(
        ' UPDATE post SET post_main_photo =? WHERE id = ?',
        [filename, postID]
      );
      console.log('圖片上傳資料庫成功', coverPhotoUpload);
      res.json(coverPhotoUpload);
      // 轉換成JSON格式
    } catch (error) {
      console.error(error);
    }
  }
);

// 行程貼文景點照片上傳(單張) luis--------------------------------------------------------------------------------------

//　圖片設定儲存空間
const storageTripPostLoc = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'public', 'tripPost', 'locPhoto'));
    console.log(__dirname);
    // 確認資料夾位置正確
  },
  // 圖片設定名稱
  filename: function (req, file, cb) {
    console.log('file', file);
    const ext = file.originalname.split('.').pop();
    cb(null, `/travel-${uuidv4()}.${ext}`);
  },
});

const uploaderTripPostLoc = multer({
  storage: storageTripPostLoc,
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
  // ,
  // // 過濾檔案的大小
  // limits: {
  //   // 1k = 1024 => 200k = 200 * 1024
  //   fileSize: 200 * 1024,
  // },
});

//===============================================================================================
router.post(
  '/tripPostLocUpload',
  uploaderTripPostLoc.single('photo'),
  async (req, res) => {
    const locateID = req.body.locateID;
    console.log('景點ＩＤ', locateID);
    // const coverFile = req.body.coverFile;
    //TODO: 偵測userID
    // console.log('貼文ＩＤ', req.body.postID);

    try {
      let filename = req.file ? 'tripPost/locPhoto' + req.file.filename : '';
      console.log('檔案名稱', filename);
      // console.log('貼文ＩＤ', postID);
      let [locPhotoUpload] = await pool.execute(
        ' UPDATE travel_days SET locate_photo =? WHERE id = ?',
        [filename, locateID]
      );
      console.log('圖片上傳資料庫成功', locPhotoUpload);
      res.json(locPhotoUpload);
      // 轉換成JSON格式
    } catch (error) {
      console.error(error);
    }
  }
);

// 行程景點照片多張上傳 luis--------------------------------------------------------------------------------------

//　圖片設定儲存空間
// const storageTripPostLoc = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join(__dirname, '..', 'public', 'tripPost', 'locPhoto'));
//     console.log(__dirname);
//     // 確認資料夾位置正確
//   },
//   // 圖片設定名稱
//   filename: function (req, file, cb) {
//     console.log('file', file);
//     const ext = file.originalname.split('.').pop();
//     cb(null, `/travel-Loc-${uuidv4()}.${ext}`);
//   },
// });

// const uploaderTripPostLoc = multer({
//   storage: storageTripPostLoc,
//   // 過濾圖片的種類
//   fileFilter: function (req, file, cb) {
//     if (
//       file.mimetype !== 'image/jpeg' &&
//       file.mimetype !== 'image/jpg' &&
//       file.mimetype !== 'image/png' &&
//       file.mimetype !== 'image/webp'
//     ) {
//       cb(new Error('上傳的檔案型態不接受'), false);
//     } else {
//       cb(null, true);
//     }
//   },
//   // ,
//   // // 過濾檔案的大小
//   // limits: {
//   //   // 1k = 1024 => 200k = 200 * 1024
//   //   fileSize: 200 * 1024,
//   // },
// });

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

// router.post(
//   '/tripPostLocUpload',
// uploaderTripPostLoc.array('photos', 8),
// async (req, res) => {
//   const locateID = req.body.locateID;
//   // const coverPhoto = req.body.preview;
//   // const coverFile = req.body.coverFile;
//   //TODO: 偵測userID
//   console.log('貼文ＩＤ', req.body.postID);
//   console.log('前端傳來檔案');//

// try {
//   let filename = req.file ? 'tripPost/locPhoto' + req.file.filename : '';
//   console.log('檔案名稱', filename);
//   // console.log('貼文ＩＤ', postID);
//   let [locPhotoUpload] = await pool.execute(
//     ' UPDATE travel_days SET locate_photo =? WHERE id = ?',
//     [filename, locateID]
//   );
//   console.log('圖片上傳資料庫成功', locPhotoUpload);
//   res.json(locPhotoUpload);
//   // 轉換成JSON格式
// } catch (error) {
//   console.error(error);
// }
//   }
// );

// 貼文留言區塊  KE//
router.get('/postComment', async (req, res) => {
  console.log('Comment postID', req.query.postID);
  const postID = req.query.postID;
  // console.log(postID);
  // console.log('===== KEKEKEKE1232131313 =====', req.session);
  // let user_id = req.session.user.id;
  try {
    let [result] = await pool.execute(
      'SELECT post_comment.*, user.social_name , user.photo FROM post_comment JOIN user ON post_comment.user_id = user.id where post_id = ?',
      [postID]
    );
    console.log('postID====7777777=====', postID);
    // console.log('user_id=====8888888=====', user_id);
    // console.log(result);
    res.json(result);
  } catch (error) {
    console.error(error);
  }
});

// 貼文留言上傳 KE//
router.post('/postCommentEdit', async (req, res, next) => {
  console.log('postCommentEdit body', req.body);
  console.log('user_id', req.session.user.id);
  try {
    let user_id = req.session.user.id;
    let result = await pool.execute(
      'INSERT INTO post_comment (post_id, user_id, comment, create_time) VALUES (?, ?, ?, ?);',
      [req.body.postID, user_id, req.body.commentText, req.body.create_time]
    );
    console.log('insert new postComment', result);
    // 回覆前端
    res.json({ message: 'ok' });
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
