const express = require('express');
const app = express();
const mysql = require('mysql2');
const pool = require('./utils/db');
const cors = require('cors');
const corsConfig = require('./utils/cors_config');

require('dotenv').config();

app.use(cors(corsConfig));

// ============== API Routers ==============
app.use(express.json());

app.get('/', (req, res) => {
  res.send('<h2>首頁<h2>');
});

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
