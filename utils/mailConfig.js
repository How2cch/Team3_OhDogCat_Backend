require('dotenv').config();

const smtpConfig = {
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_SERVER_AUTH,
    pass: process.env.MAIL_SERVER_PASSWORD,
  },
};

module.exports = smtpConfig;
