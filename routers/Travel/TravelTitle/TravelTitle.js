const express = require('express');
const router = express();
const pool = require('../../../utils/db');

router.get('/', async (req, res) => {
  let [result] = await pool.execute(
    'SELECT  title, start_time,end_time , user_id FROM travel WHERE id = 1'
  );
  // console.log('result', result);
  res.json(result);
});

module.exports = router;
