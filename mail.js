// const express = require('express');
// const app = express();
const nodemailer = require('nodemailer');
const mailConfig = require('./utils/mailConfig');
const pug = require('pug');
require('dotenv').config();
const mailTest = () => {
  let mailOptions = {
    from: '"OhDogCat! 你和毛小孩的好夥伴" ohdogcat.myfriend@gmail.com',
    to: 'paul860108@gmail.com',
    subject: '【註冊認證】 會員註冊',
  };

  const transporter = nodemailer.createTransport(mailConfig);

  mailOptions.html = pug.renderFile(__dirname + '/views/mail_template.pug', { text: '狗王' });

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log('=== error ===', error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};
module.exports = mailTest;

// fs.readFile(mailBodyPath, 'utf8', (err, mailBody) => {
//   if (err) {
//     return console.log(err);
//   }
//   // 代入 mail 本文內的 html 檔案
//   mailOptions.html = pug.renderFile(__dirname + '/views/mail_template.pug', { text: '黃穗懷' });

//   // 寄信

// });

// mg.messages
//   .create('sandbox-123.mailgun.org', {
//     from: 'Excited User <mailgun@sandbox-123.mailgun.org>',
//     to: ['test@example.com'],
//     subject: 'Hello',
//     text: 'Testing some Mailgun awesomness!',
//     html: pug.renderFile(__dirname + '/views/tracking.pug', { email: email, revenue: revenue }),
//   })
//   .then((msg) => console.log(msg)) // logs response data
//   .catch((err) => console.error(err)); // logs any error
