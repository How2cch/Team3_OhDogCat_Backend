const pool = require('../utils/db');

async function addFavoriteProduct(userId, productId) {
  let [result] = await pool.execute('INSERT INTO favorite (user_id, product_id) VALUES (?, ?)', [userId, productId]);
  console.log('addFavoriteProduct', result);
}

async function getFavoriteProduct(userId) {
  let [result] = await pool.execute('SELECT * FROM favorite WHERE user_id = ?', [userId]);
  return result;
}


async function removeFavoriteProduct(userId, productId) {
  let [result] = await pool.execute('DELETE FROM favorite WHERE user_id = ? AND product_id= ?', [userId, stockId]);
  console.log('removeFavoriteProduct', result);
}

module.exports = { addFavoriteProduct, getFavoriteProduct, removeFavoriteProduct };