const config = require("../config/config");
const hmacSHA256 = require("crypto-js/hmac-sha256");
const Base64 = require("crypto-js/enc-base64");
const { Order } = require("../models");
const User = require("../models/user.model");
const { default: axios } = require("axios");

const orders = {
  amount: 299,
  currency: "TWD",
  packages: [
    {
      id: "vip",
      amount: 299,
      products: [
        {
          name: "vip",
          quantity: 1,
          price: 299,
        },
      ],
    },
  ],
};

const createSignature = (uri, linePayBody) => {
  const nonce = Date.now();
  const encrypt = `${config.linepay.secretKey}/${
    config.linepay.version
  }${uri}${JSON.stringify(linePayBody)}${nonce}`;
  const signature = Base64.stringify(
    hmacSHA256(encrypt, config.linepay.secretKey)
  );
  const headers = {
    "Content-Type": "application/json",
    "X-LINE-ChannelId": config.linepay.channelID,
    "X-LINE-Authorization-Nonce": nonce,
    "X-LINE-Authorization": signature,
  };
  return headers;
};

const createOrder = async (req, res) => {
  const orderObj = { ...orders, currency: "TWD" };
  const timeStamp = Date.now();
  orderObj.user = req.user._id;
  orderObj.TimeStamp = timeStamp;
  orderObj.MerchantOrderNo = timeStamp;
  orderObj.Amt = orderObj.amount;
  const newOrder = await Order.create(orderObj);
  orderObj.orderId = newOrder._id;
  delete orderObj.user;
  delete orderObj.Amt;
  delete orderObj.MerchantOrderNo;
  delete orderObj.TimeStamp;
  const reqBody = {
    ...orderObj,
    redirectUrls: {
      confirmUrl: config.callback + "/v1/linePay/confirm",
      cancelUrl: config.callback + "/v1/linePay/cancel",
    },
  };
  const uri = "/payments/request";

  const url = `${config.linepay.url}/${config.linepay.version}${uri}`;

  const headers = createSignature(uri, reqBody);
  // console.log("reqBody", reqBody);
  const linePayRes = await axios.post(url, reqBody, { headers });
  console.log("linePayRes---", linePayRes.data);
  if (linePayRes?.data?.returnCode === "0000") {
    return linePayRes?.data?.info?.paymentUrl.web;
    // res.redirect(linePayRes?.data?.info?.paymentUrl.web);
  }
  return null;
};

const confirmOrder = async (req) => {
  const { transactionId, orderId } = req.query;
  const uri = `/payments/${transactionId}/confirm`;
  const order = await Order.findById(orderId);
  await User.findByIdAndUpdate(order.user, {
    isVip: true,
  });
  const linePayBody = {
    amount: order.Amt,
    currency: "TWD",
  };

  const headers = createSignature(uri, linePayBody);
  console.log("amount", order);
  const url = `${config.linepay.url}/${config.linepay.version}${uri}`;
  const linePayRes = await axios.post(url, linePayBody, { headers });
  console.log(linePayRes.data);
  return linePayRes.data;
};

module.exports = {
  orders,
  createOrder,
  confirmOrder,
};
