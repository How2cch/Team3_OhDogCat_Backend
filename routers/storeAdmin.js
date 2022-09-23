const express = require('express');
const router = express();

router.get('/exchange/:productId', (req, res) => {
  res.send('<h2>核銷頁面</h2>');
});

module.exports = router;
