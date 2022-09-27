const pool = require('../utils/db');

const isAccountExist = async (user) => {
  try {
    let [userResult] = await pool.execute(
      'SELECT email, social_name FROM user WHERE email = ? OR social_name = ?',
      [user.email, user.socialName]
    );
    return userResult;
  } catch (error) {
    console.error(error);
  }
};

const isLoginUserExist = async (user) => {
  try {
    let [userResult] = await pool.execute(
      'SELECT id, password, email, name, social_name, photo FROM user WHERE email = ? AND valid = 1 ',
      [user.email]
    );
    return userResult;
  } catch (error) {
    console.error(error);
  }
};

const insertUser = async (user) => {
  try {
    const [result] = await pool.execute(
      'INSERT INTO user (email, password, social_name, photo, create_time) VALUE (?, ?, ?, ?, ?)',
      [
        user.email,
        user.password,
        user.social_name,
        user.photo,
        user.create_time,
      ]
    );
    return result;
  } catch (error) {
    console.error(error);
  }
};
module.exports = { isAccountExist, insertUser, isLoginUserExist };
