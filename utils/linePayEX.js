const express = require('express');
const router = express.Router();
const axios = require('axios');
const { HmacSHA256 } = require('crypto-js');
const Base64 = require('crypto-js/enc-base64');

require('dotenv').config();
const {
  LINEPAY_CHANNEL_ID,
  LINEPAY_CHANNEL_SECRET_KEY,
  LINEPAY_VERSION,
  LINEPAY_SITE,
  LINEPAY_RETURN_HOST,
  LINEPAY_RETURN_CONFIRM_URL,
  LINEPAY_RETURN_CANCEL_URL,
} = process.env;

const sampleData = require('../sample/sampleData');
const orders = {};
/* GET home page. */
router
  .get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
  })
  .get('/checkout/:id', (req, res) => {
    const { id } = req.params;
    const order = sampleData[id];
    // console.log("order", order.orderId);
    order.orderId = parseInt(new Date().getTime() / 1000);
    orders[order.orderId] = order;
    // console.log("HERE",order);
    res.render('checkout', { order });
  });

// 跟 linepay 串接的 api
router
  .post('/createOrder/:orderId', async (req, res) => {
    const { orderId } = req.params;
    const order = orders[orderId];

    // console.log('createOrder', order);

    const linePayBody = {
      ...order,
      redirectUrls: {
        confirmUrl: `${LINEPAY_RETURN_HOST}${LINEPAY_RETURN_CONFIRM_URL}`,
        cancelUrl: `${LINEPAY_RETURN_HOST}${LINEPAY_RETURN_CANCEL_URL}`,
      },
    };

    try {
      const uri = '/payments/request';
      const headers = createSignature(uri, linePayBody);

      // console.log(linePayBody, signature);
      const url = `${LINEPAY_SITE}/${LINEPAY_VERSION}${uri}`;

      const linePayRes = await axios.post(url, linePayBody, { headers });

      console.log(linePayRes.data.info);

      if (linePayRes?.data?.returnCode === '0000') {
        res.redirect(linePayRes?.data?.info.paymentUrl.web);
      }

      // console.log(linePayRes);
    } catch (error) {
      console.log(error);
      res.end();
    }
  })
  .get('/linePay/confirm', async (req, res) => {
    const { transactionId, orderId } = req.query;
    console.log(transactionId, orderId);

    try {
      const order = orders[orderId];
      const linePayBody = {
        amount: order.amount,
        currency: 'TWD',
      };

      const uri = `/payments/${transactionId}/confirm`;
      const headers = createSignature(uri, linePayBody);

      const url = `${LINEPAY_SITE}/${LINEPAY_VERSION}${uri}`;
      const linePayRes = await axios.post(url, linePayBody, { headers });

      console.log(linePayRes);
    } catch (error) {
      res.end();
    }
  });

function createSignature(uri, linePayBody) {
  const nonce = parseInt(new Date().getTime() / 1000);
  const string = `${LINEPAY_CHANNEL_SECRET_KEY}/${LINEPAY_VERSION}${uri}${JSON.stringify(linePayBody)}${nonce}`;
  const signature = Base64.stringify(HmacSHA256(string, LINEPAY_CHANNEL_SECRET_KEY));

  const headers = {
    'Content-Type': 'application/json',
    'X-LINE-ChannelId': LINEPAY_CHANNEL_ID,
    'X-LINE-Authorization-Nonce': nonce,
    'X-LINE-Authorization': signature,
  };
  return headers;
}

module.exports = router;
