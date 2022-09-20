const express = require('express');
const router = express.Router();
const pool = require('../../../utils/db');

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
