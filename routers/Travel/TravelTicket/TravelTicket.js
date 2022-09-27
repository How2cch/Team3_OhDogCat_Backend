const express = require('express');
const router = express();
const pool = require('../../../utils/db');
const moment = require('moment');

router.get('/travelTicket/title', async (req, res) => {
  let [result] = await pool.execute(
    'SELECT id, product_type_id, name,description ,price,photo_path,main_photo FROM product WHERE store_id = ?',
    [20]
  );
  res.json(result);
});

//userid title 開始時間相關
router.get('/travelTitle', async (req, res) => {
  const travelid = req.query.travelid;

  let [result] = await pool.execute(
    'SELECT   title, start_time,end_time , user_id FROM travel WHERE id = ?',
    [travelid]
  );
  res.json(result);
});

//行程規劃社群頁面用 目前抓ID 2~6 宣染到前端

router.get('/travelCommunity', async (req, res) => {
  let [result] = await pool.execute(
    // 'SELECT id, title, start_time,end_time , user_id ,main_photo  FROM travel WHERE id >1 AND id < 7'
    'SELECT * FROM (travel JOIN user ON travel.user_id = user.id ) ;'
  );
  // const startDate = moment([result].start_time);
  // const endDate = moment([result].end_time);
  // const differentDate = endDate.diff(startDate, 'days');
  // console.log(startDate + '跟' + endDate + '相差' + differentDate + '天');
  // console.log('differentDate', differentDate);
  res.json(result);
});

//行程規劃 planning

router.get('/travelplanning', async (req, res) => {
  // console.log(req.query.travelid);
  const travelid = req.query.travelid;
  // console.log(req.query);
  // console.log(travelid);
  let [result] = await pool.execute(
    // 'SELECT * ,travel_detail.sort AS daysort ,travel.start_time AS Daystart_time   FROM (travel JOIN travel_detail ON travel.id = travel_id ) JOIN travel_days ON travel_days.id = travel_detail.travel_days_id;'
    // 'SELECT * ,daycount.sort AS daysort ,travel.start_time AS Daystart_time   FROM travel JOIN travel_days AS daycount  ON travel.id = daycount.travel_id WHERE travel.id =1 AND travel.valid = 1 AND daycount.valid = 1 ORDER BY days ASC , sort ASC',
    // [1]
    'SELECT  * ,sort AS daysort FROM travel_days   WHERE travel_id =? ORDER BY  daysort  ASC',
    [travelid]
  );
  // console.log('result', result);
  res.json(result);
});

//行程規劃 顯示user有幾個行程

router.get('/travelUserplanning/get', async (req, res) => {
  let [user] = await pool.execute('SELECT * FROM travel WHERE user_id = ? ', [
    2,
  ]);
  // console.log('user', user);
  res.json(user);
});
module.exports = router;
