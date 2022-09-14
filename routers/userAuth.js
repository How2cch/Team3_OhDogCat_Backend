const express = require('express');
const router = express();
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const { registerFormatRules } = require('../middlewares/userAuth.js');
const pool = require('../utils/db');
const path = require('path');

router.post('/register', registerFormatRules, (req, res) => {
  const validation = validationResult(req);
  console.log('validateResult', validation);
  if (validation.errors.length > 0) console.log('error');
  // res.status(401).json({ message: '測試' });
  res.json(req.body);
});

module.exports = router;
