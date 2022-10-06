// const express = require('express');
// const app = express();
const nodeMailer = require('nodemailer');
const mailConfig = require('./utils/mailConfig');
const pug = require('pug');
require('dotenv').config();

const sendAccountValidationMail = ({ address, code }) => {
  let mailOptions = {
    from: '"Oh!DogCat 你和毛小孩的好夥伴" ohdogcat.myfriend@gmail.com',
    to: address,
    subject: '【密碼重設】 Oh!DogCat 會員密碼重設信',
  };

  const transporter = nodeMailer.createTransport(mailConfig);

  mailOptions.html = pug.renderFile(
    __dirname + '/views/mail_password_reset.pug',
    {
      code: code,
    }
  );

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log('=== error ===', error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

module.exports = sendAccountValidationMail;
