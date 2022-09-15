const pool = require('../utils/db');

const isUserExist = async (user) => {
  let [userResult] = await pool.execute('SELECT email, social_name FROM user WHERE email = ? OR social_name = ?', [user.email, user.socialName]);
  return userResult;
};

const insertUser = async (user, hashPassword) => {
  const [result] = await pool.execute('INSERT INTO user (email, password, social_name) VALUE (?, ?, ?)', [user.email, hashPassword, user.socialName]);
  return result;
};
module.exports = { isUserExist, insertUser };
