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
module.exports = { isSocialNameExist, updateSocialName };
