const express = require('express');
const router = express();
// const bcrypt = require('bcrypt');
// const { validationResult } = require('express-validator');
// const { registerFormatRules } = require('../middlewares/userAuth.js');
const pool = require('../utils/db');
// const path = require('path');

router.get('/api', async (req, res) => {
  let [result] = await pool.execute('SELECT name FROM product WHERE id < ?', [
    11,
  ]);
  console.log('result', result);
  res.json(result);
});

module.exports = router;
