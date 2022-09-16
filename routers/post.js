const express = require('express');
const router = express();
const pool = require('../utils/db');
// 資料庫連接

// const path = require('path');

router.get('/post', async (req, res) => {
  console.log(req.query);
  try {


    let [result] = await pool.execute('SELECT * FROM post where id =?', [
      1,
    ]);
    console.log(result);
    res.json(result);
    // 轉換成JSON格式
  } catch (error) {
    console.error(error);
  }
});


module.exports = router;
