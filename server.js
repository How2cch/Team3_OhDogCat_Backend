const express = require('express');
const app = express();
const cors = require('cors');
const corsConfig = require('./utils/corsConfig');
const path = require('path');
const pool = require('./utils/db');

const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

var options = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  clearExpired: true,
  checkExpirationInterval: 900000,
  expiration: (86400000 / 24 / 60) * 10, // ? 暫時設定十分鐘
  // schema: {
  //   tableName: 'custom_sessions_table_name',
  //   columnNames: {
  //     session_id: 'session_id',
  //     expires: 'expires',
  //     data: 'data',
  //   },
  // },
};

app.use(
  session({
    key: 'session_cookie_name',
    secret: 'session_cookie_secret',
    store: new MySQLStore(options, pool),
    resave: false,
    saveUninitialized: false,
  })
);

require('dotenv').config(); // ? 叫出 .env

app.use(cors(corsConfig)); // ? 設定 cors
app.use(express.static(path.join(__dirname, 'public'))); // ? 設定可讀取靜態檔案的路徑

// ============== API Routers ==============
app.use(express.json()); // ? express 使用 body-parser 解析帶有 JSON 有效負載的傳入請求

app.get('/', async(req, res) => {
  res.send('<h4>首頁<h4>');
});

// =========================
const productDetailAPI = require('./routers/productdetail'); // ? 將 API route 整理於 ./routers 個別檔案中
app.use('/api/1.0/productdetail', productDetailAPI); // ? 讀進 API 檔案後將其視為中間件使用，第一個參數為預設 path

// =========================
const orderStepsAPI = require('./routers/ordersteps'); // ? 將 API route 整理於 ./routers 個別檔案中
app.use('/api/1.0/ordersteps', orderStepsAPI); // ? 讀進 API 檔案後將其視為中間件使用，第一個參數為預設 path

// =========================

// = user 登入註冊相關
const userAuthAPI = require('./routers/userAuth'); // ? 將 API route 整理於 ./routers 個別檔案中
app.use('/api/1.0/auth/user', userAuthAPI); // ? 讀進 API 檔案後將其視為中間件使用，第一個參數為預設 path

app.use((req, res) => {
  console.log('這個頁面找不到');
  res.status(404).send('Not Found');
});

// = 錯誤處理中間件，四個參數，第一個為 error
app.use((err, req, res) => {
  console.error('錯誤處理中間件', err);
  res.status(500).json({ message: '請洽系統管理員' });
});

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server start at ${process.env.SERVER_PORT}`);
});
