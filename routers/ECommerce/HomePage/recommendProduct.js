const express = require('express');
const router = express();
const pool = require('../../../utils/db');
// const bcrypt = require('bcrypt');
// const { validationResult } = require('express-validator');
// const { registerFormatRules } = require('../middlewares/userAuth.js');
// const path = require('path');

router.get('/', async (req, res) => {
  console.log(req.query);
  try {
    const [product] = await pool.execute(
      `SELECT product_type_id,name, description, price, per_score,photo_path,main_photo FROM product WHERE product_type_id = ${req.query.id} And description LIKE '%${req.query.name}%'`
    );
    console.log(product);
    res.json(product);
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
