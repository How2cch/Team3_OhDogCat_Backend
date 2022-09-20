const express = require('express');
const router = express();
const pool = require('../../../utils/db');

router.get('/', async (req, res) => {
  let [result] = await pool.execute(
    'SELECT * ,travel_detail.sort AS daysort ,travel.start_time AS Daystart_time   FROM (travel JOIN travel_detail ON travel.id = travel_id ) JOIN travel_days ON travel_days.id = travel_detail.travel_days_id;'
    // 'SELECT * ,travel.start_time AS Daystart_time  FROM travel JOIN travel_days AS dayCount ON travel.id = dayCount.travel_id WHERE travel_id =1'
  );
  // console.log('result', result);
  res.json(result);
});

module.exports = router;
