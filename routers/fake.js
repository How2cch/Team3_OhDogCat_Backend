const express = require('express');
const pool = require('../utils/db');
const router = express();

router.post('/', async (req, res) => {
  console.log(req.body);
  res.json(req.body);
});

module.exports = router;
