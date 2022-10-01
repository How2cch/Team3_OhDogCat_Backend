const pool = require('../utils/db');

const isAccountExist = async (user) => {
  try {
    let [userResult] = await pool.execute('SELECT email, social_name FROM user WHERE email = ? OR social_name = ?', [user.email, user.socialName]);
    return userResult;
  } catch (error) {
    console.error(error);
  }
};

const isLoginUserExist = async (user) => {
  try {
    let [userResult] = await pool.execute('SELECT id, password, email, name, social_name, photo, valid FROM user WHERE email = ? ', [user.email]);
    return userResult;
  } catch (error) {
    console.error(error);
  }
};

const insertUser = async (user) => {
  try {
    const [result] = await pool.execute('INSERT INTO user (email, password, social_name, photo, create_time) VALUE (?, ?, ?, ?, ?)', [
      user.email,
      user.password,
      user.social_name,
      user.photo,
      user.create_time,
    ]);
    return result;
  } catch (error) {
    console.error(error);
  }
};

const creatUserValidationCode = async (user, code, expired_time) => {
  try {
    const [result] = await pool.execute('REPLACE INTO user_validation (code, user_id, expired_time) VALUES (?,?,?)', [code, user, expired_time]);
    return true;
  } catch (error) {
    console.log(error);
  }
};

const getValidationInfo = async (user) => {
  try {
    const [result] = await pool.execute('SELECT * FROM user_validation WHERE user_id = ?', [user]);
    return result[0];
  } catch (error) {
    console.log(error);
  }
};

const updateAccountValid = async (user) => {
  try {
    await pool.execute('UPDATE user SET valid = 1 WHERE id = ?', [user]);
    return true;
  } catch (error) {
    console.log(error);
  }
};
module.exports = { isAccountExist, insertUser, isLoginUserExist, creatUserValidationCode, getValidationInfo, updateAccountValid };
