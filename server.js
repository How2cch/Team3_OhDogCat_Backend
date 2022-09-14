const express = require('express');
const app = express();
const pool = require('./utils/db');
const cors = require('cors');
const corsConfig = require('./utils/cors_config');

require('dotenv').config(); // ? 叫出 .env

app.use(cors(corsConfig)); // ? 設定 cors

// ============== API Routers ==============
// = user 登入註冊相關
const userAuthAPI = require('./routers/userAuth'); // ? 將 API route 整理於 ./routers 個別檔案中
app.use('/api/1.0/auth', userAuthAPI); // ? 讀進 API 檔案後將其視為中間件使用，第一個參數為預設 path

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
