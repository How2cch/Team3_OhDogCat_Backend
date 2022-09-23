const express = require('express');
const router = express.Router();
const pool = require('../../../utils/db');

router.post('/submit/tripdetail', async (req, res) => {
  try {
    let nameobj = { ...req.body.mapName };
    console.log(nameobj[0]);

    let [result] = await pool.execute('INSERT INTO travel(title) VALUES (?);', [
      nameobj[0],
    ]);
    console.log('這是新增地圖行程', result);
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
    console.log('這是新增行程', result);
  } catch (e) {
    console.log('新增行程錯誤', e);
  }

  res.json({ message: '新增ok' });
});
module.exports = router;
