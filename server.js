const express = require('express');
const app = express();
const cors = require('cors');
const corsConfig = require('./utils/corsConfig');
const path = require('path');
const pool = require('./utils/db');

const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const sessionConfig = require('./utils/sessionConfig');

const http = require('http');
const server = http.createServer(app);
require('./socket').createServer(server);

require('dotenv').config(); // ? 叫出 .env

app.use(cors(corsConfig)); // ? 設定 cors

app.use(
  session({
    key: 'session_cookie_name',
    secret: 'session_cookie_secret',
    store: new MySQLStore(sessionConfig, pool),
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.static(path.join(__dirname, 'public'))); // ? 設定可讀取靜態檔案的路徑

app.set('view engine', 'pug');
// todo: 告訴 express 視圖在哪裡
app.set('./', 'views');
// todo: 測試 Server Side Render 的寫法
app.get('/', (req, res) => {
  // do something
  res.render('mail_template', {
    text: '黃穗懷',
  });
});
app.get('/register-vetify', (req, res) => {
  // do something
  res.send('<h2>註冊成功<h2>');
});

// = 核銷假後台頁面
const storeAdmin = require('./routers/storeAdmin');
app.use('/store', storeAdmin);

// ============== API Routers ==============
app.use(express.json()); // ? express 使用 body-parser 解析帶有 JSON 有效負載的傳入請求

// // =============雨信區

// //Rain 票卷相關 //userid title 開始時間相關

const TravelGetAPI = require('./routers/Travel/TravelTicket/TravelTicket');
app.use('/api/1.0/', TravelGetAPI);

// // Rain post更改日期 travel title
const TraveldetailUpdate = require('./routers/Travel/Travel_post_LocationID/travelLocationID');
app.use('/api/1.0/', TraveldetailUpdate);

//  =============雨信區

// // ----EC穗懷區
// // =============================================================================================EC穗懷區
// // ----HomePage推薦商品
// const EcHomepagesAPI = require('./routers/ECommerce/HomePage/recommendProduct');
// =============================================================================================EC區
// ----HomePage & ECHomepage 推薦商品
const EcHomepagesAPI = require('./routers/ECommerce/Recommend/recommendProduct');
app.use('/api/1.0/product', EcHomepagesAPI);

// ----Filter篩選商品
const ECFilterAPI = require('./routers/ECommerce/Filter/filterProduct');
app.use('/api/1.0/filter', ECFilterAPI);

// ----Collect收藏
const CollectAPI = require('./routers/ECommerce/Collect/collect');
app.use('/api/1.0/collect', CollectAPI);

// ----productdetail 商品細節
const DetailAPI = require('./routers/ECommerce/Detail/detailProduct');
app.use('/api/1.0/productdetail', DetailAPI);

// ----Cart購物車
const CartAPI = require('./routers/ECommerce/Cart/cart');
app.use('/api/1.0/cart', CartAPI);

// ----LinePay結帳
const LineAPI = require('./utils/linePay');
app.use('/api/1.0/line', LineAPI);

// ----建立訂單
const createOrderAPI = require('./routers/ECommerce/CreateOrder/createOrder');
app.use('/api/1.0/createorder', createOrderAPI);

// ----刪除購物車
const deleteCartAPI = require('./routers/ECommerce/DeleteCart/deleteCart');
app.use('/api/1.0/deletecart', deleteCartAPI);

// ----LinePay
// const CartAPI = require('./routers/ECommerce/Cart/cart');
// app.use('/api/1.0/cart', CartAPI);
// ============================================================================================EC區

// = user 登入註冊相關
const userAuthAPI = require('./routers/userAuth'); // ? 將 API route 整理於 ./routers 個別檔案中
app.use('/api/1.0/auth/user', userAuthAPI); // ? 讀進 API 檔案後將其視為中間件使用，第一個參數為預設 path
// = user 資料相關
const userAdminApi = require('./routers/userAdmin'); // ? 將 API route 整理於 ./routers 個別檔案中
app.use('/api/1.0/user', userAdminApi);

app.get('/', (req, res) => {
  res.send('<h4>首頁<h4>');
});

// =============================================================================================社群區

// ----社群孝強區

// CommunityHomePage //
const communityHomePageAPI = require('./routers/Community/CommunityHomePage/homePage'); // ? 將 API route 整理於 ./routers 個別檔案中
app.use('/api/1.0/communityHomePage', communityHomePageAPI); // ? 讀進 API 檔案後將其視為中間件使用，第一個參數為預設 path

// 貼文編輯上傳

// const communityPostEditAPI = require('./routers/post');
// app.use('/api/1.0/post', communityPostEditAPI);

// ----社群luis區

const CommunityTEST = require('./routers/post');
app.use('/api/1.0/community', CommunityTEST);

const postTEST = require('./routers/post');
app.use('/api/1.0/post', postTEST);
const TripTEST = require('./routers/post');
app.use('/api/1.0/tripfetch', TripTEST);

const recommendProductAPI = require('./routers/postRecommend');
app.use('/api/1.0/post', recommendProductAPI);

// const testAPI = require('./routers/haui');
// app.use('/api/1.0/huai', testAPI);

// =============================================================================================社群區

app.use((req, res) => {
  console.log('這個頁面找不到');
  res.status(404).send('Not Found');
});
// = 錯誤處理中間件，四個參數，第一個為 error
app.use((err, req, res) => {
  console.error('錯誤處理中間件', err);
  res.status(500).json({ message: '請洽系統管理員' });
});

server.listen(process.env.SERVER_PORT, () => {
  console.log(`Server start at ${process.env.SERVER_PORT}`);
});
