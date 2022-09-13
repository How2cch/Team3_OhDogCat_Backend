require('dotenv').config();

const mysql = require('mysql2');

const pool = mysql
  .createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    // ? 限制 pool 連線上限
    connectionLimit: 10,
    // ? date 不要轉成 date Object
    dateStrings: true,
  })
  .promise();

module.exports = pool;
