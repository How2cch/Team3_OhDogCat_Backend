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
      'SELECT s.id AS store_id, s.name AS store_name,s.photo AS store_photo, o.product_id, p.name AS product_name, p.photo_path, p.main_photo , o.product_quantity, o.order_no, o.product_price, o.total, o.pay, o.coupon_number, o.coupon_name, o.order_time, o.comment_status FROM (order_buying AS o JOIN product AS p ON o.product_id = p.id) JOIN store AS s ON p.store_id = s.id WHERE o.user_id = ? ORDER BY `o`.`order_time` DESC',
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
    let [result] = await pool.execute('REPLACE INTO password_reset (code, user_id, expired_time) VALUES (?,?,?) ', [code, user, expired_time]);
    console.log(result);
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
      'SELECT s.name AS store_name, f.product_id, p.name AS product_name, p.photo_path, p.main_photo, p.og_price, p.price, p.intro FROM (favorite AS f JOIN product AS p ON f.product_id = p.id) JOIN store AS s ON p.store_id = s.id WHERE f.user_id = ?',
      [user]
    );
    return data;
  } catch (error) {
    console.error(error);
  }
};

const getUserPassword = async (user) => {
  try {
    const [data] = await pool.execute('SELECT password FROM user WHERE id = ?', [user]);
    return data[0];
  } catch (error) {
    console.error(error);
  }
};

const updateUserPassword = async (password, user) => {
  try {
    await pool.execute('UPDATE user SET password = ? WHERE id = ?', [password, user]);
    return true;
  } catch (error) {
    console.error(error);
  }
};

const getConversationList = async (user) => {
  try {
    const [data] = await pool.execute(
      'SELECT c.*, s.name AS store_name, s.photo AS store_photo FROM `conversation` AS c JOIN store AS s ON c.store_id = s.id WHERE c.user_id = ?',
      [user]
    );
    return data;
  } catch (error) {
    console.error(error);
  }
};

const getConversationDetail = async (ids) => {
  try {
    let sqlWHERE = '';
    for (const [index, item] of ids.entries()) {
      if (index === ids.length - 1) {
        sqlWHERE += `conversation_id = ${item}`;
      } else {
        sqlWHERE += `conversation_id = ${item} OR `;
      }
    }
    if (sqlWHERE === '') sqlWHERE = 'conversation_id = 0';
    const [data] = await pool.execute(
      'SELECT c.*, p.id AS product_id, p.name AS product_name, p.photo_path, p.main_photo, p.price, p.per_score FROM `conversation_detail` AS c LEFT JOIN product AS p ON c.product_id = p.id  WHERE ' +
        sqlWHERE
    );
    return data;
  } catch (error) {
    console.error(error);
  }
};

const postTextMessage = async (conversation_id, content, time) => {
  try {
    const [data] = await pool.execute('INSERT INTO conversation_detail (conversation_id, type, content, sender, create_time) VALUES (?,?,?,?,?)  ', [
      conversation_id,
      1,
      content,
      1,
      time,
    ]);
    return data;
  } catch (error) {
    console.error(error);
  }
};

const postStickerMessage = async (conversation_id, sticker, time) => {
  try {
    const [data] = await pool.execute('INSERT INTO conversation_detail (conversation_id, type, sticker, sender, create_time) VALUES (?,?,?,?,?)  ', [
      conversation_id,
      3,
      sticker,
      1,
      time,
    ]);
    return data;
  } catch (error) {
    console.error(error);
  }
};

const postPhotoMessage = async (conversation_id, photoPath, time) => {
  console.log(conversation_id, photoPath, time);
  try {
    const [data] = await pool.execute('INSERT INTO conversation_detail (conversation_id, type, content, sender, create_time) VALUES (?,?,?,?,?)  ', [
      conversation_id,
      2,
      photoPath,
      1,
      time,
    ]);
    return data;
  } catch (error) {
    console.error(error);
  }
};

const postProductMessage = async (conversation_id, product_id, time) => {
  try {
    const [data] = await pool.execute('INSERT INTO conversation_detail (conversation_id, type, product_id, sender, create_time) VALUES (?,?,?,?,?)  ', [
      conversation_id,
      4,
      product_id,
      1,
      time,
    ]);
    return data;
  } catch (error) {
    console.error(error);
  }
};

const getConversationProduct = async (storeId) => {
  try {
    const [data] = await pool.execute('SELECT * FROM product WHERE store_id = ?', [storeId]);
    return data;
  } catch (error) {
    console.error(error);
  }
};

const createConversation = async (userId, storeId) => {
  try {
    const [data] = await pool.execute('INSERT IGNORE INTO conversation ( user_id, store_id) VALUES (?,?)', [userId, storeId]);
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
  getUserPassword,
  updateUserPassword,
  getConversationList,
  getConversationDetail,
  postTextMessage,
  postStickerMessage,
  postPhotoMessage,
  getConversationProduct,
  postProductMessage,
  createConversation,
};
