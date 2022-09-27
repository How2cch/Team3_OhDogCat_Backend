const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const pool = require('../../../utils/db');
const path = require('path');

const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(
      null,
      path.join(__dirname, '..', '..', '..', 'public', 'travel', 'post')
    );
  },
  // 圖片名稱
  filename: function (req, file, cb) {
    // console.log('file', file);
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
router.post(
  '/post/datelocationId',
  uploader.single('photo'),
  async (req, res) => {
    try {
      let filename = req.file ? 'travel/post' + req.file.filename : '';
      let result = await pool.execute(
        'UPDATE  travel  SET  title=(?) , main_photo =(?), end_time =(?) WHERE id = (?) ',
        [req.body.title, filename, req.body.date, req.body.travelID]
      );

      // console.log('這是新增行程', result);
    } catch (e) {
      // console.log('新增行程錯誤', e);
    }
    res.json({ message: '新增ok' });
  }
);

////////////// 搜尋bar 新增地點名稱 經緯度
router.post('/submit/tripdetail', async (req, res) => {
  try {
    let nameobj = { ...req.body.mapName };
    // console.log('req.body地圖經緯度內容', req.body);
    const mapsphoto = req.body.mapPhoto.toString();
    // FLOOR(RAND() * 15 + 2) 是隨機參數
    let [result] = await pool.execute(
      'INSERT INTO travel_days(travel_id ,days,sort,locate_name,google_photo ,latitude ,	longitude,valid) VALUES (?,?,FLOOR(RAND() * 15 + 2),?,?,?,?,?)',
      [
        req.body.gettravelid,
        req.body.getDays,
        nameobj[0],
        mapsphoto,
        req.body.selected.lat,
        req.body.selected.lng,
        1,
      ]
    );
    console.log('搜尋bar 新增地點名稱 經緯度', result);
  } catch (e) {
    console.log('新增行程錯誤', e);
  }

  res.json({ message: '新增ok' });
});

//post 行程名稱 開始結束日期

router.post('/submit/addDate', async (req, res) => {
  console.log(req.body);
  try {
    let [result] = await pool.execute(
      'INSERT INTO travel(title,start_time,end_time) VALUES (?,?,?);',
      [req.body.title, req.body.start_time, req.body.end_time]
    );
    // console.log('這是新增行程名稱日期', result);
  } catch (e) {
    console.log('新增行程錯誤', e);
  }

  res.json({ message: '新增ok' });
});

module.exports = router;

//////////變更 景點順序sort
router.post('/post/locationSort', async (req, res) => {
  console.log('getsort', req.body);
  console.log('sort', req.body.getsort);
  console.log('getlocateid', req.body.getlocateid);
  // console.log(req);
  try {
    let result = await pool.execute(
      'UPDATE  travel_days   SET  sort=(?) WHERE id = (?) ',
      [req.body.getsort, req.body.getlocateid]
    );
  } catch (e) {
    console.log('新增行程錯誤', e);
  }
  res.json({ message: '新增ok' });
});
