const express = require('express');
const router = express();
const pool = require('../utils/db');
// const bcrypt = require('bcrypt');
// const { validationResult } = require('express-validator');
// const { registerFormatRules } = require('../middlewares/userAuth.js');
// const path = require('path');

router.get('/coupon', async (req, res) => {
  let [result] = await pool.execute('SELECT * FROM coupon WHERE id < ?', [3]);
  console.log(result);
  res.json(result);
});
// router.get('/all', async (req, res) => {
//   let [result] = await pool.execute('SELECT name FROM product WHERE id < ?', [11]);
//   console.log(result);
//   res.json(result);
// })

module.exports = router;
