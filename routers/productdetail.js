const express = require('express');
const router = express();
const pool = require('../utils/db');
// const bcrypt = require('bcrypt');
// const { validationResult } = require('express-validator');
// const { registerFormatRules } = require('../middlewares/userAuth.js');
// const path = require('path');

router.get('/items', async (req, res) => {
  let [result] = await pool.execute('SELECT * FROM product WHERE id < ?', [2]);
  // console.log(result);
  res.json(result[0]);
})
// router.get('/all', async (req, res) => {
//   let [result] = await pool.execute('SELECT name FROM product WHERE id < ?', [11]);
//   console.log(result);
//   res.json(result);
// })

module.exports = router;

