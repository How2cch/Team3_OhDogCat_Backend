const express = require('express');
const router = express();
const pool = require('../../../utils/db');
const moment = require('moment');

router.get('/travelTicket/title', async (req, res) => {
  const userID = req.session.user.id;
  // console.log('Ticket的userSessionID', userID);
  let [result] = await pool.execute(
    'SELECT * FROM ((favorite JOIN product ON favorite.product_id = product.id) JOIN store ON product.store_id = store.id) WHERE user_id =? LIMIT 1',
    [userID]
  );
  res.json(result);
});

//userid title 開始時間相關
router.get('/travelTitle', async (req, res) => {
  const travelid = req.query.travelid;

  let [result] = await pool.execute(
    'SELECT   title, start_time,end_time , user_id ,main_photo FROM travel WHERE id = ?',
    [travelid]
  );
  res.json(result);
});

//行程規劃社群頁面用 目前抓ID 2~6 宣染到前端

router.get('/travelCommunity', async (req, res) => {
  let [result] = await pool.execute(
    // 'SELECT * FROM (travel JOIN user ON travel.user_id = user.id ) ;'
    // '    SELECT * FROM (travel JOIN user ON travel.user_id = user.id ) WHERE travel.id >2 AND travel.id < 150  LIMIT 5 '
    '       SELECT *, travel.id AS travelId FROM (travel JOIN user ON travel.user_id = user.id ) WHERE travel.id >2 AND travel.id < 150  LIMIT 5'
    // 'SELECT id, title, start_time,end_time , user_id ,main_photo  FROM travel WHERE id >2 AND id < 150  LIMIT 4'
  );

  res.json(result);
});

//行程規劃 planning

router.get('/travelplanning', async (req, res) => {
  const travelid = req.query.travelid;
  let [result] = await pool.execute(
    'SELECT  * ,sort AS daysort FROM travel_days   WHERE  travel_id =? AND valid = 1 ORDER BY  daysort  ASC',
    [travelid]
  );
  // console.log('result', result);
  res.json(result);
});

// 拿行程經緯度到前端
router.get('/travelLocate', async (req, res) => {
  const travelid = req.query.travelid;
  let [result] = await pool.execute(
    'SELECT  * ,sort AS daysort FROM travel_days   WHERE  travel_id =? AND valid = 1 ORDER BY  daysort  ASC',
    [travelid]
  );
  // console.log('result', result);
  res.json(result);
});

//行程規劃 顯示user有幾個行程

router.get('/travelUserplanning/get', async (req, res) => {
  const userID = req.session.user.id;

  let [user] = await pool.execute(
    'SELECT * FROM travel WHERE user_id = ?  AND valid = 1 ORDER BY id DESC ',
    [userID]
  );
  console.log('user', user);
  res.json(user);
});
module.exports = router;
