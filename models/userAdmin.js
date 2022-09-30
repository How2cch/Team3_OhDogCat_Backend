const pool = require('../utils/db');

const isSocialNameExist = async (socialName) => {
  try {
    let [userResult] = await pool.execute('SELECT social_name FROM user WHERE social_name = ?', [socialName]);
    return userResult;
  } catch (error) {
    console.error(error);
  }
};

const updateSocialName = async (id, socialName) => {
  try {
    let updateResult = await pool.execute('UPDATE user SET social_name = ?  WHERE id = ?', [socialName, id]);
    return updateResult;
  } catch (error) {
    console.error(error);
  }
};

const updateName = async (id, name) => {
  try {
    let updateResult = await pool.execute('UPDATE user SET name = ?  WHERE id = ?', [name, id]);
    return updateResult;
  } catch (error) {
    console.error(error);
  }
};

const updatePhone = async (id, phone) => {
  try {
    let updateResult = await pool.execute('UPDATE user SET phone = ?  WHERE id = ?', [phone, id]);
    return updateResult;
  } catch (error) {
    console.error(error);
  }
};

const updateGender = async (id, gender) => {
  try {
    let updateResult = await pool.execute('UPDATE user SET gender = ?  WHERE id = ?', [gender, id]);
    return updateResult;
  } catch (error) {
    console.error(error);
  }
};

const getUserVoucher = async (id) => {
  try {
    const [data] = await pool.execute(
      'SELECT product.id AS product_id, product.name AS product_name , product.intro, product.description, product.valid_time_start, product.valid_time_end, product.main_photo, product.photo_path , voucher.quantity, photo.file_name AS photos, store.name AS store_name, store.id AS store_id FROM (((`voucher` AS voucher JOIN product AS product ON voucher.product_id = product.id) LEFT JOIN product_photo AS photo ON voucher.product_id = photo.product_id ) JOIN store AS store ON product.store_id = store.id ) WHERE voucher.user_id = ?',
      [id]
    );
    return data;
  } catch (error) {
    console.error(error);
  }
};

const getUserProfile = async (id) => {
  try {
    const [data] = await pool.execute('SELECT name, social_name, email, photo, phone, gender FROM user WHERE id = ?', [id]);
    return data[0];
  } catch (error) {
    console.error(error);
  }
};

const getUserOrderInfo = async (id) => {
  try {
    const [data] = await pool.execute(
      'SELECT s.name AS store_name, o.product_id, p.name AS product_name, p.photo_path, p.main_photo , o.product_quantity, o.order_no, o.product_price, o.total, o.pay, o.coupon_number, o.coupon_name, o.order_time, o.comment_status FROM (order_buying AS o JOIN product AS p ON o.product_id = p.id) JOIN store AS s ON p.store_id = s.id WHERE o.user_id = ? ORDER BY `o`.`order_time` DESC',
      [id]
    );
    return data;
  } catch (error) {
    console.error(error);
  }
};

const isOrderScored = async (order_no) => {
  try {
    const [data] = await pool.execute('SELECT COUNT(*) FROM order_buying WHERE order_no = ? AND comment_status = 1', [order_no]);
    return data[0]['COUNT(*)'] === 0 ? false : true;
  } catch (error) {
    console.error(error);
  }
};

const postScore = async (product, user, comment, score, order_no) => {
  try {
    await pool.execute('INSERT INTO product_comment (product_id, product_comment_user_id, comment, product_comment_score) VALUES (?,?,?,?)', [product, user, comment, score]);
    await pool.execute('UPDATE order_buying SET comment_status = 1  WHERE order_no = ? ', [order_no]);
    return true;
  } catch (error) {
    console.error(error);
  }
};

const isEmailExist = async (email) => {
  try {
    const [data] = await pool.execute('SELECT id  FROM user WHERE email = ?', [email]);
    return data[0] ? data[0] : false;
  } catch (error) {
    console.error(error);
  }
};

const createPwdResetCode = async (code, user, expired_time) => {
  try {
    await pool.execute('REPLACE INTO password_reset (code, user_id, expired_time) VALUES (?,?,?) ', [code, user, expired_time]);
    return true;
  } catch (error) {
    console.error(error);
  }
};

const pwdResetCodeValidation = async (code) => {
  try {
    const [data] = await pool.execute('SELECT * FROM password_reset WHERE code = ?', [code]);
    return data[0];
  } catch (error) {
    console.error(error);
  }
};

const resetPassword = async (code, user, newPassword) => {
  try {
    await pool.execute('UPDATE password_reset SET status = 0  WHERE code = ?', [code]);
    await pool.execute('UPDATE user SET password = ?  WHERE id = ?', [newPassword, user]);
    return true;
  } catch (error) {
    console.error(error);
  }
};

const getUserCollectionInfo = async (user) => {
  try {
    const [data] = await pool.execute(
      'SELECT s.name AS store_name, f.product_id, p.name AS product_name, p.photo_path, p.main_photo, p.og_price, p.price FROM (favorite AS f JOIN product AS p ON f.product_id = p.id) JOIN store AS s ON p.store_id = s.id WHERE f.user_id = ?',
      [user]
    );
    return data;
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  isSocialNameExist,
  updateSocialName,
  getUserVoucher,
  getUserProfile,
  updateName,
  updatePhone,
  updateGender,
  getUserOrderInfo,
  isOrderScored,
  postScore,
  isEmailExist,
  createPwdResetCode,
  pwdResetCodeValidation,
  resetPassword,
  getUserCollectionInfo,
};
