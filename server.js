const express = require('express');
const app = express();
const mysql = require('mysql2');
const pool = require('./utils/db');
const cors = require('cors');
const corsConfig = require('./utils/cors_config');
const path = require('path');
// console.log(pool);
require('dotenv').config();

app.use(cors(corsConfig));
app.use(express.static(path.join(__dirname, 'public'))); // ? 設定可讀取靜態檔案的路徑

// ============== API Routers ==============
app.use(express.json());

app.get('/', async(req, res) => {
  res.send('<h4>首頁<h4>');
  let [result] = await pool.execute('SELECT name FROM product WHERE id < ?', [11]);
  console.log('result',result);
  res.json(result);
});

// ------------------

// ---------------------



// ----EC穗懷區
const ecHpCommodityAPI = require('./routers/ECommerce/HomePage/recommendProduct');
app.use('/api/1.0/product', ecHpCommodityAPI);

// ----EC穗懷區

const userTESTAPI = require('./routers/test');
app.use('/api/1.0/test', userTESTAPI);

// = user 登入註冊相關
const userAuthAPI = require('./routers/userAuth');
app.use('/api/1.0/auth', userAuthAPI);

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