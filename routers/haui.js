let [locateDetail] = {
  id: [
    [3, 1, 4],
    [2, 5, 6, 7],
  ],
  locate_context: [
    ['ejfiejfi', 'this is test', '風好大'],
    ['#＃＃花蓮海洋公園好無聊', '泡溫泉', '風景很可以', '城市要做不完ㄌㄚ'],
  ],
  locate_duration: [
    ['efjiejfiejf', 'taipei', '科'],
    ['1.5hr', 'dfdf', '可', 'QQ'],
  ],
};
console.log('Id');

// // 單獨取一般貼文資料 抬頭 luis
// router.get('/post', async (req, res) => {
//   console.log(req.query);
//   try {
//     let [result] = await pool.execute(
//       'SELECT * FROM post WHERE id >= ? AND status >=1 AND post_type_id =1',
//       [
//         1,
//         //  'SELECT cate.id as cate_id, cate.name AS cate_name, tag.name AS tag_name, tag.id AS tag_id FROM product_tag as tag JOIN product_tag_category AS cate ON tag.tag_category_id = cate.id WHERE tag.product_type_id = 2 ORDER BY `tag_id` ASC'
//       ]
//     );
//     console.log(result);
//     res.json(result);
//     // 轉換成JSON格式
//   } catch (error) {
//     console.error(error);
//   }
// });

// // 單獨取行程貼文資料 抬頭 luis
// router.get('/tripPost', async (req, res) => {
//   console.log(req.query);
//   try {
//     let [result] = await pool.execute(
//       'SELECT * FROM post WHERE id = ? AND status >= 1 AND post_type_id =2',
//       [3]
//     );
//     console.log(result);
//     res.json(result);
//     // 轉換成JSON格式
//   } catch (error) {
//     console.error(error);
//   }
// });

// module.exports = router;

// // 搜尋列表

// router.get('/searchList', async (req, res) => {
//   const { search } = req.query;
//   console.log(req.query);
//   try {
//     let [result] = await pool.execute(
//       `SELECT * FROM post WHERE (title LIKE '%${search}%') OR (content LIKE '%${search}%') OR (coordinate LIKE '%${search}%') OR (tags LIKE '%${search}%');`
//     );
//     console.log(result);
//     res.json(result);
//     // 轉換成JSON格式
//   } catch (error) {
//     console.error(error);
//   }
// });

// // 匯入行程(travel)＋ (travel_days)編輯用
// router.get('/tripDetailImport', async (req, res) => {
//   console.log(req.query);
//   try {
//     let [result] = await pool.execute(
//       'SELECT * FROM travel JOIN travel_days AS daycount ON travel.id = daycount.travel_id WHERE travel.id =? AND travel.valid =1 AND daycount.valid = 1  ORDER BY days ASC, sort ASC',
//       [134]
//     );
//     console.log(result);
//     res.json(result);
//     // 轉換成JSON格式
//   } catch (error) {
//     console.error(error);
//   }
// });

// module.exports = router;

// // 行程貼文 (post)關聯(travel)日程景點明細(travel_days) （匯入景點資訊）可在關聯景點貼文內容
// router.get('/tripPostDetail', async (req, res) => {
//   console.log(req.query);
//   try {
//     let [result] = await pool.execute(
//       'SELECT * FROM ((post JOIN travel ON post.travel_id = travel.id) JOIN user ON post.user_id = user.id) JOIN travel_days AS daycount ON post.travel_id = daycount.travel_id WHERE post.travel_id =? ORDER BY days ASC, sort ASC',
//       [134]
//     );
//     console.log(result);
//     res.json(result);
//     // 轉換成JSON格式
//   } catch (error) {
//     console.error(error);
//   }
// });

// module.exports = router;

// // 回傳資料
// router.post('/tripPostDetailEdit', async (req, res) => {
//   console.log(req.query);
//   console.log(req.body);
//   try {
//     let [result] = await pool.execute(
//       'UPDATE `travel_days` SET `locate_name` = "efefweffjiajefi",`locate_duration` = "efjiejfiejf",`locate_context` = "ejfiejfi" WHERE `travel_id` = ? AND `days` = 1 AND `sort` = 1',
//       [134]
//     );
//     console.log(result);
//     res.json(result);
//     // 轉換成JSON格式
//   } catch (error) {
//     console.error(error, '更新資料錯誤');
//   }
//   res.json({ message: '更新資料ＯＫ' });
// });

// module.exports = router;
