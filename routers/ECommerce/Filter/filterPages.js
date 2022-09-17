
app.get('/:stockId', async (req, res, next) => {
  // const stockId = req.params.stockId;
  const stockId = 2;

 // 分頁
  // 透過 query string 取得目前要第幾頁的資料
  // 如果沒有設定，就預設要第一頁的資料
  let page = req.query.page || 1;
  // 每一頁拿五筆資料
  const perPage = 5;
  // 取得總筆數
  let [total] = await pool.execute('SELECT COUNT(*) AS total FROM `product` WHERE product_type_id=?', [stockId]);
  // [ { total: Q57 } ]
  total = total[0].total;
  console.log(total);
  // 計算總頁數 Math.ceil
  let lastPage = Math.ceil(total / perPage);

  // 計算 offset
  const offset = perPage * (page - 1);

  // 根據 perPage 及 offset 去取得資料
  let [data] = await pool.execute('SELECT * FROM stock_prices WHERE stock_id = ? ORDER BY date LIMIT ? OFFSET ?', [stockId, perPage, offset]);

  // 把取得的資料回覆給前端
  res.json({
    pagination: {
      total, // 總共有幾筆
      perPage, // 一頁有幾筆
      page, // 目前在第幾頁
      lastPage, // 總頁數
    },
    data,
  });
});