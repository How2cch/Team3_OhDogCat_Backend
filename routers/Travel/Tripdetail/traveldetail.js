const express = require('express');
const router = express.Router();
const pool = require('../../../utils/db');

router.post('/submit/tripdetail', async (req, res) => {
  console.log(req.body);
  console.log(req.body.selected.lat);
  console.log(req.body.selected.lng);
  console.log('mapName', req.body.mapName);

  // let phone = await req.body[0];
  // let main_photo = await req.body[1];
  // let name = await req.body[2]
  // let lat = await req.body[3];

  // console.log('這照片', main_photo);
  // console.log('這是經緯度', lat);
  // console.log('地點名稱', name);
  // console.log('這是電話號碼', phone);

  try {
    let nameobj = { ...req.body.mapName };
    console.log(nameobj[0]);

    let [result] = await pool.execute('INSERT INTO travel(title) VALUES (?);', [
      nameobj[0],
    ]);
    console.log('這是新增行程', result);
  } catch (e) {
    console.log('新增行程錯誤', e);
  }

  res.json({ message: '新增ok' });
});

module.exports = router;
