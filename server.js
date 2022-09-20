const express = require('express');
const app = express();
const cors = require('cors');
const corsConfig = require('./utils/corsConfig');
const path = require('path');

require('dotenv').config(); // ? 叫出 .env

app.use(cors(corsConfig)); // ? 設定 cors
app.use(express.static(path.join(__dirname, 'public'))); // ? 設定可讀取靜態檔案的路徑

// ============== API Routers ==============
app.use(express.json()); // ? express 使用 body-parser 解析帶有 JSON 有效負載的傳入請求
// = user 登入註冊相關
const userAuthAPI = require('./routers/userAuth'); // ? 將 API route 整理於 ./routers 個別檔案中
app.use('/api/1.0/auth/user', userAuthAPI); // ? 讀進 API 檔案後將其視為中間件使用，第一個參數為預設 path

app.get('/', (req, res) => {
  res.send('<h4>首頁<h4>');
});

//==== 孝強 ====//
// CommunityHomePage //
const communityHomePageAPI = require('./routers/Community/CommunityHomePage/homePage'); // ? 將 API route 整理於 ./routers 個別檔案中
app.use('/api/1.0/communityHomePage', communityHomePageAPI); // ? 讀進 API 檔案後將其視為中間件使用，第一個參數為預設 path

//==== 孝強 ====//

// ----社群luis區
const CommunityTEST = require('./routers/post');
app.use('/api/1.0/community', CommunityTEST);

const recommendProductAPI = require('./routers/postRecommend');
app.use('/api/1.0/post', recommendProductAPI);


// ----社群luis區 要比404前面

app.use((req, res) => {
  console.log('這個頁面找不到');
  res.status(404).send('Not Found');
});
// = 錯誤處理中間件，四個參數，第一個為 error
app.use((err, req, res, next) => {
  console.error('錯誤處理中間件', err);
  res.status(500).json({ message: '請洽系統管理員' });
});

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server start at ${process.env.SERVER_PORT}`);
});
