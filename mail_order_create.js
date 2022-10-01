const nodeMailer = require('nodemailer');
const mailConfig = require('./utils/mailConfig');
const pug = require('pug');
require('dotenv').config();

const sendOrderCreateMail = ({ address, user_name, product_name, product_quantity, payment_type, store_name, total }) => {
  let mailOptions = {
    from: '"OhDogCat! 你和毛小孩的好夥伴" ohdogcat.myfriend@gmail.com',
    to: address,
    subject: '【訂單成立】 Oh!DogCat 會員訂單成立通知信',
  };

  const transporter = nodeMailer.createTransport(mailConfig);

  mailOptions.html = pug.renderFile(__dirname + '/views/mail_order_create.pug', {
    user_name: user_name,
    product_name: product_name,
    product_quantity: product_quantity,
    payment_type: payment_type,
    store_name: store_name,
    total: total,
  });

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log('=== error ===', error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

module.exports = sendOrderCreateMail;
