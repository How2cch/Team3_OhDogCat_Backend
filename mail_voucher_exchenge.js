// const express = require('express');
// const app = express();
const nodeMailer = require('nodemailer');
const mailConfig = require('./utils/mailConfig');
const pug = require('pug');
require('dotenv').config();

const sendVoucherExchengeMail = ({ address, userName, exchangeQuantity, productName, staffId, exchangeTime, storeName }) => {
  let mailOptions = {
    from: '"OhDogCat! 你和毛小孩的好夥伴" ohdogcat.myfriend@gmail.com',
    to: address,
    subject: '【票券兌換】 Oh!DogCat 會員票券兌換通知',
  };

  const transporter = nodeMailer.createTransport(mailConfig);

  mailOptions.html = pug.renderFile(__dirname + '/views/mail_voucher_exchange.pug', {
    name: userName,
    product_name: productName,
    quantity: exchangeQuantity,
    staff_id: staffId,
    exchange_time: exchangeTime,
    store_name: storeName,
  });

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log('=== error ===', error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

module.exports = sendVoucherExchengeMail;
