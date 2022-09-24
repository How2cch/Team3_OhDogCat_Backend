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
module.exports = { isSocialNameExist, updateSocialName, getUserVoucher };
