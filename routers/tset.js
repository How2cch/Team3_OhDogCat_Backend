const express = require('express');
const router = express();


// const bcrypt = require('bcrypt');
// const { validationResult } = require('express-validator');
// const { registerFormatRules } = require('../middlewares/userAuth.js');
const pool = require('../utils/db');
// 資料庫連接


// const path = require('path');

router.get('/api', async (req, res) => {
  let [result] = await pool.execute('SELECT * FROM product WHERE id < ?', [11]);
  console.log(result);
  res.json(result);
});

module.exports = router;
//d

